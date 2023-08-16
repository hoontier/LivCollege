//FriendsAndClasses.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFriend, unselectFriend, clearSelectedFriends } from '../../features/friendsSlice'; // make sure you have an action to remove friend
import { Link } from 'react-router-dom';
import FriendClasses from './FriendClasses';
import '../../styles/FriendsAndClasses.css'

const FriendsAndClasses = () => {
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
    } else {
      dispatch(setSelectedFriend(friend)); // add to selected friends
    }
  };

  return (
    <div className="container-friends">
      <h3>Your Friends</h3>
      {friends.map((friend, index) => (
        <div className="friend-entry" key={index}>
          <img src={friend.photoURL} alt={"ProfilePhoto"} />
          <p>{friend.name}</p>
          <button onClick={() => handleToggleClasses(friend)}>Toggle Classes</button>
          <Link to={`/friend/${friend.id}`}>View Profile</Link>
          {selectedFriends.some(selected => selected.id === friend.id) && (
            <div className="friend-classes-container">
              <FriendClasses friend={friend} /> {/* pass friend as prop */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FriendsAndClasses;
