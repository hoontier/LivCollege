import React from 'react';

const Friend = ({friend, viewFriendClasses}) => {
    return (
        <div>
            <p>{friend.username}</p>
            <button onClick={() => viewFriendClasses(friend.id)}>View Classes</button>
        </div>
    );
}

export default Friend;
