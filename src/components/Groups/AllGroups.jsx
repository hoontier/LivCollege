//AllGroups.jsx
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Link } from 'react-router-dom';

const AllGroups = ({ onSelectGroup }) => {
    const [publicGroups, setPublicGroups] = useState([]);

    useEffect(() => {
        const fetchPublicGroups = async () => {
            const groupsColRef = collection(db, 'groups');
            const publicGroupsQuery = query(groupsColRef, where('privateState', '==', false));

            const publicGroupsData = [];
            const querySnapshot = await getDocs(publicGroupsQuery);
            querySnapshot.forEach((doc) => {
                publicGroupsData.push({
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description,
                });
            });

            setPublicGroups(publicGroupsData);
        };

        fetchPublicGroups();
    }, []); // As there are no dependencies, an empty array ensures this useEffect runs once.

    const handleViewGroupProfile = (group) => {
        onSelectGroup(group.id);
    };

    return (
        <div className="all-groups">
            <h4>All Public Groups:</h4>
            <ul>
                {publicGroups.map(group => (
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

export default AllGroups;
