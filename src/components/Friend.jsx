// Friend.jsx
import React, { useState } from 'react';
import FriendClasses from './FriendClasses';

const Friend = ({ friend, viewFriendClasses, selectedFriendId }) => {
  const [showClasses, setShowClasses] = useState(false);

  const toggleClasses = () => {
    setShowClasses(!showClasses);
  };

  const isFriendSelected = selectedFriendId === friend.id;

  return (
    <div>
      <p>{friend.name} {friend.lastName}</p>
      <button onClick={() => {
        viewFriendClasses(friend.id);
        toggleClasses();
      }}>
        {showClasses ? 'Hide Classes' : 'View Classes'}
      </button>
      {showClasses && isFriendSelected && (
        <FriendClasses friendClasses={friend.classes} />
      )}
    </div>
  );
};

export default Friend;
