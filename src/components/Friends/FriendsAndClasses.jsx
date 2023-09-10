import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFriend, unselectFriend, clearSelectedFriends } from '../../features/friendsSlice';
import { Link } from 'react-router-dom';
import FriendClasses from './FriendClasses';
import styles from '../../styles/FriendsAndClasses.module.css';

const FriendCard = ({ friend, handleViewProfile, handleToggleClasses }) => {
    return (
        <div className={styles.friendCardContainer}>
            <div className={styles.flexColumn}>
                <div className={styles.flexRow}>
                    <img src={friend.photoURL} alt="ProfilePhoto" className={styles.profileImage} />
                    <p className={styles.boldText}>{friend.name}</p>
                </div>
                <div className={styles.flexRow}>
                    <button onClick={() => handleViewProfile(friend)} className={styles.button}>
                        View profile
                    </button>
                    <button onClick={() => handleToggleClasses(friend)} className={styles.button}>
                        Toggle classes
                    </button>
                </div>
            </div>
        </div>
    );
};

const ITEMS_PER_PAGE = 2;

const FriendsAndClasses = ({ onSelectFriend, onManageFriendsClick }) => {
  const friends = useSelector((state) => state.friends.friends);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // for the search input value
  const [filteredFriends, setFilteredFriends] = useState(friends); // to store the filtered friends
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm) {
      setFilteredFriends(
        friends.filter(friend =>
          friend.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredFriends(friends);
    }
    setCurrentPage(1); // Reset page number after search
  }, [searchTerm, friends]);
  
  useEffect(() => {
    // Clear the selected friends when the component is unmounted
    return () => {
      dispatch(clearSelectedFriends());
    };
  }, [dispatch]);

  const handleToggleClasses = (friend) => {
    const friendExists = selectedFriends.some(f => f.id === friend.id);

    if (friendExists) {
        dispatch(unselectFriend(friend.id)); // remove from selected friends
        onSelectFriend(null);  // Notify Home component about the deselection
    } else {
        dispatch(setSelectedFriend(friend)); // add to selected friends
        onSelectFriend(friend); // Notify Home component about the selected friend
    }
  };

  const handleViewProfile = (friend) => {
    onSelectFriend(friend.id); // pass the id to the FriendProfile component through the Home component
  };

  const totalPages = Math.ceil(filteredFriends.length / ITEMS_PER_PAGE);

  const getDisplayedFriends = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFriends.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.mainFlexColumn}>
        <div className={styles.friendsHeader}> 
          <h3>Your Friends</h3>
          <button onClick={() => onManageFriendsClick(true)} className={styles.button}>
              Manage Friends
          </button>
        </div>

        {/* Search input */}
        <div className={styles.searchBar}>
            <input 
                type="text" 
                placeholder="Search Friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className={styles.mainFlexRow}>
            {getDisplayedFriends().map((friend) => (
                <FriendCard 
                    friend={friend} 
                    handleViewProfile={handleViewProfile} 
                    handleToggleClasses={handleToggleClasses}
                />
            ))}
        </div>
        <div className={styles.paginationControls}>
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
          )}
          <span>Page {currentPage} of {totalPages}</span>
          {currentPage < totalPages && (
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
          )}
        </div>
    </div>
  );
}

export default FriendsAndClasses;