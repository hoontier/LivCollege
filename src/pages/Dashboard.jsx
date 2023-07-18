import React from 'react';
import { auth } from '../config/firebaseConfig';
import { signOut } from "firebase/auth";
import UserClasses from '../components/UserClasses';
import Schedule from "../components/Schedule";

const Dashboard = ({userClasses, setUser}) => {
    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            setUser(null); // Set user to null when signed out
        }).catch((error) => {
            console.error("An error happened during sign-out:", error);
        });
    }
    
    return (
        <>
            <div>
                <button onClick={signOutUser}>Sign Out</button>
            </div>
            <UserClasses userClasses={userClasses} />
            <Schedule classes={userClasses} />
        </>
    );
}

export default Dashboard;

