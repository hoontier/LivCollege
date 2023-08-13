//Friends.jsx
import React from 'react';
import Header from '../components/HeaderAndFooter/Header';  
import Footer from '../components/HeaderAndFooter/Footer';
import AllUsers from '../components/Friends/AllUsers';
import FriendAndClasses from '../components/Friends/FriendAndClasses';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/DisplayUserClasses';

function Friends() {
    return (
        <div className="friends">
            <Header />
            <AllUsers />
            <FriendAndClasses />
            <DisplayUserClasses />
            <Schedule />
            <Footer />
        </div>
    );
}

export default Friends;
