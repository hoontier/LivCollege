import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Header from '../components/HeaderAndFooter/Header';
import AddGroupEvent from '../components/Groups/AddGroupEvent';
import Schedule from '../components/Schedule';
import InviteToGroup from '../components/Groups/InviteToGroup';
import GroupMembers from '../components/Groups/GroupMembers';
import { useSelector, useDispatch } from 'react-redux';
import { joinGroupInFirestore } from '../features/groupsSlice';
import styles from '../styles/ProfileStyles.module.css';

function GroupProfile() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [showAddEvent, setShowAddEvent] = useState(false);  // This state determines if AddGroupEvent should be shown
    const [showInviteToGroup, setShowInviteToGroup] = useState(false);  // This state determines if InviteToGroup should be shown
    const [members, setMembers] = useState(0);
    const user = useSelector((state) => state.data.user);
    const userGroups = user ? user.groups : []; // Check if user exists before accessing its groups property
    const isUserPartOfGroup = userGroups.includes(groupId);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchGroupData = async () => {
            const groupDocRef = doc(db, 'groups', groupId);
            const groupData = (await getDoc(groupDocRef)).data();

            if (groupData) {
                setGroup(groupData);
                setMembers(groupData.members.length);
            }
        };

        fetchGroupData();
    }, [groupId]);

    if (!group) return <p>Loading...</p>;

    const toggleShowAddEvent = () => {
        setShowAddEvent(prevState => !prevState);
    }

    const handleJoinGroup = () => {
        dispatch(joinGroupInFirestore({groupId, userId: user.id}));
        setMembers(prevState => prevState + 1);
    }
    
    return (
        <>
            <Header />
            <div className={styles.container}>
                <section className={styles.profile}> 
                    <div className={styles['group-info']}>
                        <h3 className={styles['header-text']}>{group.title}</h3>
                        <p>Description: {group.description}</p>
                        <p>Members: {members}</p>
                    </div>
                    {
                        isUserPartOfGroup ? 
                        <>
                            <button 
                                className={styles['profile-button']}
                                onClick={() => setShowInviteToGroup(prevState => !prevState)}
                            >
                                {showInviteToGroup ? "Hide Invites" : "Invite to Group"}
                            </button>
                            <button
                                className={styles['profile-button']}
                                onClick={toggleShowAddEvent}
                            >
                                {showAddEvent ? "Hide Add Event" : "Add Event"}
                            </button>
                        </>
                        :
                        <button 
                            className={styles['profile-button']}
                            onClick={handleJoinGroup}
                        >
                            Join Group
                        </button>
                    }
                    {showInviteToGroup && <InviteToGroup groupId={groupId} />}
                    {showAddEvent && <AddGroupEvent group={groupId} />}
                    </section>
                {group && group.members && <GroupMembers groupMembersIds={group.members} />}
            </div>
            <Schedule />
        </>
    );
}

export default GroupProfile;
