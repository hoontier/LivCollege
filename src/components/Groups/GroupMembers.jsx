//GroupMembers.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { setSelectedFriend } from '../../features/friendsSlice'; 
import '../../styles/FriendsAndClasses.css';

const GroupMembers = ({ groupMembersIds }) => {
  const [groupMembers, setGroupMembers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMembers = async () => {
      const memberDetails = [];

      for (let memberId of groupMembersIds) {
        const userDocRef = doc(db, 'users', memberId);
        const userData = (await getDoc(userDocRef)).data();
        if (userData) {
          memberDetails.push(userData);
        }
      }

      setGroupMembers(memberDetails);
    };

    fetchMembers();
  }, [groupMembersIds]);

  const handleSelectFriend = (member) => {
    dispatch(setSelectedFriend(member));
  };

  return (
    <div className="container-friends">
      <h3>Group Members</h3>
      {groupMembers.map((member, index) => (
        <div className="friend-entry" key={index}>
          <img src={member.photoURL} alt="ProfilePhoto" />
          <p>{member.name}</p>
          {/* Use the ID from the groupMembersIds prop for the Link */}
          <Link to={`/friend/${groupMembersIds[index]}`} onClick={() => handleSelectFriend(member)}>View Profile</Link>
        </div>
      ))}
    </div>
  );  
}

export default GroupMembers;
