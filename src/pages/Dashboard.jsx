import React, { useState } from 'react';
import { auth } from '../config/firebaseConfig';
import { signOut } from "firebase/auth";
import UserClasses from '../components/UserClasses';
import FriendClasses from '../components/FriendClasses'; // Import new FriendClasses component
import Schedule from "../components/Schedule";
import Users from '../components/Users';
import Friends from '../components/Friends';

const Dashboard = ({userClasses, setUser, users, userFriends, userFriendRequests, userOutgoingRequests, handleFriendRequest, handleAcceptRequest, handleRejectRequest, handleCancelRequest}) => {
    const [selectedFriendClasses, setSelectedFriendClasses] = useState([]);

    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            setUser(null); // Set user to null when signed out
        }).catch((error) => {
            console.error("An error happened during sign-out:", error);
        });
    }
    
    const selectFriend = (friendId) => {
        // Retrieve the friend's classes from the users array.
        const friendData = users.find(user => user.id === friendId);
        const friendClasses = friendData?.classes;
        setSelectedFriendClasses(friendClasses || []);
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
            <UserClasses userClasses={userClasses} />
            <FriendClasses friendClasses={selectedFriendClasses} /> 
            <Schedule classes={userClasses} />
        </>
    );
}

export default Dashboard;
