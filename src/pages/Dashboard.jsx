//Dashboard.jsx
import React from 'react';  
import AllUsers from '../components/AllUsers';
import FriendClasses from '../components/FriendClasses';
import Schedule from '../components/Schedule';
import UserClasses from '../components/UserClasses';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();

    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            navigate("/signin");
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