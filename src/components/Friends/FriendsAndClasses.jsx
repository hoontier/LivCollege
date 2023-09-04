//FriendsAndClasses.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedFriend, unselectFriend, clearSelectedFriends } from '../../features/friendsSlice'; // make sure you have an action to remove friend
import { Link } from 'react-router-dom';
import FriendClasses from './FriendClasses';

const FriendCard = (friend) => {
  return (
    <div className="bg-gray-200 p-2 shadow-md rounded flex-1">
    <div className="flex flex-col">
      <div className="flex gap-2 items-center"> 
      <img src={friend.photoURL} alt="ProfilePhoto" className="w-12 h-12 rounded-full" />
      <p className="font-bold my-0">{friend.name}</p>
      </div>
      <div className="flex gap-2">
      <button onClick={() => handleViewProfile(friend)} className="mt-4 bg-indigo-600 rounded px-2 text-gray-200 shadow text-sm ">
        View profile
        </button>
        <button onClick={() => handleToggleClasses(friend)} className="mt-4 bg-indigo-600 rounded px-2 text-gray-200 shadow text-sm ">
        Toggle classes
        </button>
    </div>
      </div>
    </div>
  );
};

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
    <div className="flex flex-col h-full">
      <h3>Your Friends</h3>
      <div className="flex flex-col gap-3 flex-1">
      {friends.map((friend) => {return FriendCard(friend)})}
      </div>
    </div>
  );  
}

export default FriendsAndClasses;
