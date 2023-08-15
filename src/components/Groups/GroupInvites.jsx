//GroupInvites.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { fetchUserDetails } from '../../features/dataSlice';
import { cancelGroupInvite, acceptInviteThunk, fetchGroupInvitesFromFirestore } from '../../features/groupsSlice';

const GroupInvites = () => {
    const user = useSelector((state) => state.data.user);
    const dispatch = useDispatch();
    const invites = useSelector((state) => state.groups.groupInvites);

    useEffect(() => {
        if (user) {
            dispatch(fetchGroupInvitesFromFirestore(user.id));
        }
    }, [user, dispatch]);
    


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
