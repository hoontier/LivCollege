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
  setIsEditingUser
}) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );  

  const selectFriend = (friendId) => {
    const friendData = users.find((user) => user.id === friendId);
    if (!selectedFriends.find((friend) => friend.id === friendId)) {
      setSelectedFriends((prevSelectedFriends) => {
        if (prevSelectedFriends.length < 4) {
          return [...prevSelectedFriends, friendData]; // add a new friend only if less than 4 are already selected
        }
        return prevSelectedFriends;
      });
    } else {
      setSelectedFriends((prevSelectedFriends) =>
        prevSelectedFriends.filter((friend) => friend.id !== friendId) // remove the friend if it's already selected
      );
    }
  };


  const handleEditClick = (e) => {
    e.preventDefault();
    setIsEditingUser(true);
      
    // Redirect to the dashboard
    navigate('/setup');
  }



  return (
    <>
      <div>
        <button onClick={signOutUser}>Sign Out</button>
      </div>
      <Users
        users={filteredUsers}
        userFriends={userFriends}
        userFriendRequests={userFriendRequests}
        userOutgoingRequests={userOutgoingRequests}
        handleFriendRequest={handleFriendRequest}
        handleAcceptRequest={handleAcceptRequest}
        handleRejectRequest={handleRejectRequest}
        handleCancelRequest={handleCancelRequest}
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />
      <Friends friends={userFriends} selectFriend={selectFriend} />
      {selectedFriends.map(friend => (
        <FriendClasses 
          key={friend.id} 
          friendClasses={friend.classes} 
          friendName={friend.name}
        />
      ))}
      <UserClasses userClasses={userClasses} />
      <button onClick={handleEditClick}>Edit Classes and User Info</button>
      <Schedule userClasses={userClasses} friendClasses={selectedFriends.map((friend, index) => {
        return {
          friendName: friend.name,
          classes: friend.classes,
          color: ["#FF9800", "#4CAF50", "#9C27B0", "#3F51B5"][index], // color depends on the index
        };
      })}/>
    </>
  );
};

export default Dashboard;