//FriendsAndClasses.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFriend, unselectFriend, clearSelectedFriends } from '../../features/friendsSlice'; // make sure you have an action to remove friend
import { Link } from 'react-router-dom';
import FriendClasses from './FriendClasses';
import styles from '../../styles/FriendsAndClasses.module.css'

const FriendsAndClasses = ({ onSelectFriend }) => {
  const friends = useSelector((state) => state.friends.friends);
  const selectedFriends = useSelector((state) => state.friends.selectedFriends); // changed to 'selectedFriends'
  const dispatch = useDispatch();

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


  return (
    <div className={styles['container-friends']}>
      <h3>Your Friends</h3>
      {friends.map((friend, index) => (
        <div className={styles['friend-entry']} key={friend.id || index}>
            <img src={friend.photoURL} alt="ProfilePhoto" />
            <p>{friend.name}</p>
            <div style={{ marginLeft: 'auto' }}>
                <button onClick={() => handleViewProfile(friend)}>View Profile</button>
                <button onClick={() => handleToggleClasses(friend)}>Toggle Classes</button>
            </div>
        </div>
      ))}
    </div>
  );  
}

export default FriendsAndClasses;
