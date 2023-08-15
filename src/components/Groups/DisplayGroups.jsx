// DisplayGroups.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const DisplayGroups = () => {
    const user = useSelector((state) => state.data.user);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            // Check if user and user.groups both exist
            if (!user || !user.groups) return;
    
            const fetchedGroups = [];
            for (let groupId of user.groups) {
                const groupDocRef = doc(db, 'groups', groupId);
                const groupData = (await getDoc(groupDocRef)).data();
                if (groupData) {  // Also check if groupData is valid before accessing its properties
                    fetchedGroups.push({
                        id: groupId,
                        title: groupData.title,
                        description: groupData.description,
                    });
                }
            }
            setGroups(fetchedGroups);
        };
    
        fetchGroups();
    }, [user]);
    

    return (
        <div className="display-groups">
            <h4>Your Groups:</h4>
            <ul>
                {groups.map(group => (
                    <li key={group.id}>
                        <h5>{group.title}</h5>
                        <p>{group.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DisplayGroups;
