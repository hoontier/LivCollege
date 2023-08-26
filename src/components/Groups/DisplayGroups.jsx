//DisplayGroups.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Link } from 'react-router-dom';

const DisplayGroups = ({ onSelectGroup }) => {
    const user = useSelector((state) => state.data.user);
    const userGroups = user ? user.groups : []; // Check if user exists before accessing its groups property    
    const [fetchedGroups, setFetchedGroups] = useState([]); 

    useEffect(() => {
        const fetchGroups = async () => {
            if (!userGroups || userGroups.length === 0) return; // Check if userGroups exists and is not empty

            const groupsData = [];
            for (let groupId of userGroups) { // Use userGroups instead of user.groups
                const groupDocRef = doc(db, 'groups', groupId);
                const groupData = (await getDoc(groupDocRef)).data();
                if (groupData) {
                    groupsData.push({
                        id: groupId,
                        title: groupData.title,
                        description: groupData.description,
                    });
                }
            }
            setFetchedGroups(groupsData); 
        };
    
        fetchGroups();
    }, [userGroups]); // Only include userGroups in dependency array as that's what we are using

    const handleViewGroupProfile = (group) => {
        onSelectGroup(group.id);
    };


    return (
        <div className="display-groups">
            <h4>Your Groups:</h4>
            <ul>
                {fetchedGroups.map(group => (
                    <li key={group.id}>
                        <h5>{group.title}</h5>
                        <p>{group.description}</p>
                        <button onClick={() => handleViewGroupProfile(group)}>View Group Profile</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DisplayGroups;
 