// FriendClasses.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFriend } from '../../features/friendsSlice';
import { Link } from 'react-router-dom';
import FriendClasses from './FriendClasses';

const FriendsAndClasses = () => {
  const friends = useSelector((state) => state.friends.friends);
  const selectedFriend = useSelector((state) => state.friends.selectedFriend);
  const dispatch = useDispatch();

  const handleToggleClasses = (friend) => {
    if (selectedFriend && selectedFriend.id === friend.id) {
      dispatch(setSelectedFriend(null));
    } else {
      dispatch(setSelectedFriend(friend));
    }
  };

  return (
    <div>
      <h3>Your Friends</h3>
      {friends.map((friend, index) => (
        <div key={index}>
          <p>{friend.name}</p>
          <button onClick={() => handleToggleClasses(friend)}>Toggle Classes</button>
          <Link to={`/friend/${friend.id}`}>View Profile</Link>
          {selectedFriend && selectedFriend.id === friend.id && <FriendClasses />}
        </div>
      ))}
    </div>
  );
}

export default FriendsAndClasses;