import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { sendGroupInvite, cancelGroupInvite } from '../../features/groupsSlice';

const InviteToGroup = ({ groupId }) => {
    const friends = useSelector(state => state.friends.friends);
    const outgoingInvites = useSelector(state => state.groups.outgoingInvites);
    const [inviteDetails, setInviteDetails] = useState([]);

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.data.user);

    const fetchGroupInvites = async () => {
        const groupDocRef = doc(db, 'groups', groupId);
        const groupData = (await getDoc(groupDocRef)).data();
        if (groupData) {
            dispatch({ type: 'groups/setOutgoingInvites', payload: groupData.outgoingInvites || [] });
        }
    };

    useEffect(() => {
        fetchGroupInvites();
    }, [groupId, dispatch]);  // Only depends on groupId and dispatch

    const fetchInviteDetails = async (invites) => {
        const inviteDetailsArr = await Promise.all(invites.map(async inviteId => {
            const userDocRef = doc(db, 'users', inviteId);
            const userData = (await getDoc(userDocRef)).data();
            return {
                id: inviteId,
                ...userData
            };
        }));
        setInviteDetails(inviteDetailsArr);
    };

    useEffect(() => {
        fetchInviteDetails(outgoingInvites);
    }, [outgoingInvites]);  // Only depends on outgoingInvites
    

    const handleSendInvite = (friendId) => {
        dispatch(sendGroupInvite({ groupId, friendId }));
    };
    
    const handleCancelInvite = (friendId) => {
        dispatch(cancelGroupInvite({ groupId, friendId }));
        setInviteDetails(inviteDetails.filter(user => user.id !== friendId));
    };
    
    

    return (
        <div>
            <div>
                <h2>Friends</h2>
                {friends.map(friend => (
                    <div key={friend.id}>
                        <img src={friend.photoURL} alt="ProfilePhoto" />
                        <p>{friend.name} {friend.lastName}</p>
                        {!outgoingInvites.includes(friend.id) && (
                            <button onClick={() => handleSendInvite(friend.id)}>Invite to Group</button>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <h2>Outgoing Invites</h2>
                 {inviteDetails.map(user => (
                    <div key={user.id}>
                        <img src={user.photoURL} alt="ProfilePhoto" />
                        <p>{user.name} {user.lastName}</p>
                        <button onClick={() => handleCancelInvite(user.id)}>Cancel Invite</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InviteToGroup;
