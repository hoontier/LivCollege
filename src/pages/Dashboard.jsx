//Dashboard.jsx
// Renders the AllUsers, FriendClasses, userClasses, and Schedule components

import React from 'react';  
import { useSelector } from 'react-redux';
import AllUsers from '../components/AllUsers';
import FriendClasses from '../components/FriendClasses';
import Schedule from '../components/Schedule';
import UserClasses from '../components/UserClasses';
import { signOut } from 'firebase/auth';

function Dashboard() {
    const userClasses = useSelector((state) => state.classes.userClasses);
    const friends = useSelector((state) => state.friends.friends);

    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            //reload the page
            window.location.reload();
        }).catch((error) => {
            console.error("An error happened during sign-out:", error);
        });
    }
    
    return (
        <div className="dashboard">
            <div >
              <button onClick={signOutUser} >Sign Out</button>
            </div> 
            <AllUsers />
            <FriendClasses />
            <UserClasses />
            <Schedule />
        </div>
    );
    }

export default Dashboard;