import React from 'react';  
import AllUsers from '../components/AllUsers';
import FriendClasses from '../components/FriendClasses';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/DisplayUserClasses';
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

    // Function to handle the navigation to the Setup page
    const goToSetup = () => {
        navigate("/setup");
    }
    
    return (
        <div className="dashboard">
            <button onClick={signOutUser} >Sign Out</button>
            <button onClick={goToSetup}>Edit Profile and Classes</button>
            <AllUsers />
            <FriendClasses />
            <DisplayUserClasses />
            <Schedule />
        </div>
    );
}

export default Dashboard;
