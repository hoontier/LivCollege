//GroupInvites.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { fetchUserDetails } from '../../features/dataSlice';
import { cancelGroupInvite, acceptInviteThunk } from '../../features/groupsSlice';

const GroupInvites = () => {
    const user = useSelector((state) => state.data.user);
    const [invites, setInvites] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchInvites = async () => {
            if (!user || !user.groupInvites) return;

            const fetchedInvites = [];
            for (let groupId of user.groupInvites) {
                const groupDocRef = doc(db, 'groups', groupId);
                const groupData = (await getDoc(groupDocRef)).data();
                if (groupData) {
                    fetchedInvites.push({
                        id: groupId,
                        title: groupData.title,
                        description: groupData.description,
                    });
                }
            }
            setInvites(fetchedInvites);
        };

        fetchInvites();
    }, [user]);


    const handleAcceptInvite = (groupId) => {
        console.log(user.id);
        dispatch(acceptInviteThunk({ groupId, userId: user.id }));
    };

    const handleDeclineInvite = (groupId) => {
        dispatch(cancelGroupInvite({ groupId, friendId: user.id }));
    };

    return (
        <div className="group-invites">
            <h4>Your Group Invitations:</h4>
            <ul>
                {invites.map(invite => (
                    <li key={invite.id}>
                        <h5>{invite.title}</h5>
                        <p>{invite.description}</p>
                        <button onClick={() => handleAcceptInvite(invite.id)}>Accept</button>
                        <button onClick={() => handleDeclineInvite(invite.id)}>Decline</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GroupInvites;
