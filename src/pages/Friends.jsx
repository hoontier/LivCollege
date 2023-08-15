//Friends.jsx
import React, { useState } from 'react'; // Import useState
import Header from '../components/HeaderAndFooter/Header';  
import Footer from '../components/HeaderAndFooter/Footer';
import UsersAndRequests from '../components/Friends/UsersAndRequests';
import FriendsAndClasses from '../components/Friends/FriendsAndClasses';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';

function Friends() {
    // State to track the visibility of UsersAndRequests component
    const [showUsersAndRequests, setShowUsersAndRequests] = useState(false);

    return (
        <div className="friends">
            <Header />
            
            {/* Toggle button to show/hide UsersAndRequests */}
            <button onClick={() => setShowUsersAndRequests(prev => !prev)} style={{marginTop: "20px"}}>
                {showUsersAndRequests ? 'Hide Users' : 'Add Friends'}
            </button>
            
            {/* Conditionally render the UsersAndRequests component */}
            {showUsersAndRequests && <UsersAndRequests />}
            
            <FriendsAndClasses />
            <DisplayUserClasses />
            <Schedule />
            <Footer />
        </div>
    );
}

export default Friends;
