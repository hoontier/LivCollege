// Friends.jsx
import React from 'react';
import Friend from './Friend';

const Friends = ({ friends, selectFriend }) => {
    return (
        <div>
            <h3>Your Friends</h3>
            {friends.map((friend, index) => (
                <Friend key={index} friend={friend} viewFriendClasses={selectFriend} />
            ))}
        </div>
    );
}

export default Friends;
