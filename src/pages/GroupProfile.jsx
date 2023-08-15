import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import AddGroupEvent from '../components/Groups/AddGroupEvent';
import InviteToGroup from '../components/Groups/InviteToGroup';
import { useSelector } from 'react-redux';
import '../styles/ProfileStyles.css';

function GroupProfile() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [showAddEvent, setShowAddEvent] = useState(false);  // This state determines if AddGroupEvent should be shown
    const [showInviteToGroup, setShowInviteToGroup] = useState(false);  // This state determines if InviteToGroup should be shown
    const user = useSelector((state) => state.data.user);
    const userGroups = user ? user.groups : []; // Check if user exists before accessing its groups property
    const isUserPartOfGroup = userGroups.includes(groupId);

    useEffect(() => {
        const fetchGroupData = async () => {
            const groupDocRef = doc(db, 'groups', groupId);
            const groupData = (await getDoc(groupDocRef)).data();

            if (groupData) {
                setGroup(groupData);
            }
        };

        fetchGroupData();
    }, [groupId]);

    if (!group) return <p>Loading...</p>;

    return (
        <>
            <Header />
            <div className="container">
                <section className="profile"> 
                    <div className="group-info">
                        <h3 className="header-text">{group.title}</h3>
                        <p>Description: {group.description}</p>
                        <p>Members: {group.members?.length || 0}</p>
                    </div>
                    {
                        isUserPartOfGroup ? 
                        <button 
                            className="profile-button"
                            onClick={() => setShowInviteToGroup(prevState => !prevState)}
                        >
                            {showInviteToGroup ? "Hide Invites" : "Invite to Group"}
                        </button>
                        :
                        <button 
                            className="profile-button"
                            onClick={handleJoinGroup}
                        >
                            Join Group
                        </button>
                    }
                    {showInviteToGroup && <InviteToGroup groupId={groupId} />}
                    {showAddEvent && <AddGroupEvent group={groupId} />}
                </section>
            </div>
            <Footer />
        </>
    );
}

export default GroupProfile;
