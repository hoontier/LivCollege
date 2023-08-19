//GroupMembers.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { setSelectedFriend, unselectFriend, clearSelectedFriends } from '../../features/friendsSlice'; 
import FriendClasses from '../Friends/FriendClasses';
import styles from '../../styles/FriendsAndClasses.module.css';

const GroupMembers = ({ groupMembersIds }) => {
  const [groupMembers, setGroupMembers] = useState([]);
  const selectedFriends = useSelector((state) => state.friends.selectedFriends); // changed to 'selectedFriends'
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMembers = async () => {
      const memberDetails = [];
  
      for (let memberId of groupMembersIds) {
          const userDocRef = doc(db, 'users', memberId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
              const userData = userDoc.data();
              // IMPORTANT: Store the document ID as 'id' in the user data
              userData.id = userDoc.id;
              memberDetails.push(userData);
          }
      }
  
      setGroupMembers(memberDetails);
    };
  

    fetchMembers();
    return () => {
      dispatch(clearSelectedFriends());
    };
  }, [groupMembersIds, dispatch]);

  const handleToggleClasses = (friend) => {
    console.log("Friend being toggled: ", friend.id);
    console.log("Current selected friends: ", selectedFriends);
    const friendExists = selectedFriends.some(f => f.id === friend.id);
    console.log("Friend Exists: ", friendExists);

    if (friendExists) {
      dispatch(unselectFriend(friend.id)); // dispatch unselect if exists
    } else {
      dispatch(setSelectedFriend(friend)); // otherwise, select the friend
    }
 }; 
  
  
  return (
    <div className={styles['container-friends']}>
      <h3>Group Members</h3>
      {groupMembers.map((member, index) => (
        <div className={styles['friend-entry']} key={member.id || index}>
          <img src={member.photoURL} alt="ProfilePhoto" />
          <p>{member.name}</p>
          <Link to={`/friend/${member.id}`}>View Profile</Link>
          <button onClick={() => handleToggleClasses(member)}>Toggle Classes</button>
        </div>
      ))}
      {selectedFriends.map(friend => (
        <div key={friend.id} className={styles['friend-classes-container']}>
          <h4>{friend.name}'s Classes:</h4>
          <FriendClasses friend={friend} />
        </div>
      ))}
    </div>
  );
}

export default GroupMembers;