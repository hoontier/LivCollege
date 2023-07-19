// Dashboard.jsx
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import UserClasses from '../components/UserClasses';
import FriendClasses from '../components/FriendClasses';
import Schedule from '../components/Schedule';
import Users from '../components/Users';
import Friends from '../components/Friends';
import { auth } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({
  userClasses,
  setUser,
  users,
  userFriends,
  userFriendRequests,
  userOutgoingRequests,
  handleFriendRequest,
  handleAcceptRequest,
  handleRejectRequest,
  handleCancelRequest,
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const navigate = useNavigate();

  const signOutUser = () => {
    signOut(auth).then(() => {
      console.log("Sign-out successful.");
      setUser(null); // Set user to null when signed out
      navigate('/signin'); // Navigate to login page
    }).catch((error) => {
      console.error("An error happened during sign-out:", error);
    });
}


  const selectFriend = (friendId) => {
    setSelectedFriendId((prevSelectedFriendId) =>
      prevSelectedFriendId === friendId ? null : friendId
    );
  };

  const getSelectedFriendClasses = () => {
    if (selectedFriendId) {
      const friendData = users.find((user) => user.id === selectedFriendId);
      return friendData?.classes || [];
    }
    return [];
  };

  const getSelectedFriendName = () => {
    if (selectedFriendId) {
        const friendData = users.find((user) => user.id === selectedFriendId);
        return friendData?.name || '';
    }
    return '';
  };

  return (
    <>
      <div>
        <button onClick={signOutUser}>Sign Out</button>
      </div>
      <Users
        users={users}
        userFriends={userFriends}
        userFriendRequests={userFriendRequests}
        userOutgoingRequests={userOutgoingRequests}
        handleFriendRequest={handleFriendRequest}
        handleAcceptRequest={handleAcceptRequest}
        handleRejectRequest={handleRejectRequest}
        handleCancelRequest={handleCancelRequest}
      />
      <Friends friends={userFriends} selectFriend={selectFriend} />
      {selectedFriendId && (
        <FriendClasses friendClasses={getSelectedFriendClasses()} friendName={getSelectedFriendName()}/>
      )}
      <UserClasses userClasses={userClasses} />
      <Schedule classes={userClasses} />
    </>
  );
};

export default Dashboard;