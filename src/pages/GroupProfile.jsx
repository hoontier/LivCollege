import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'react-redux'; 
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import '../styles/ProfileStyles.css';

function GroupProfile() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);

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
                </section>
            </div>
            <Footer />
        </>
    );
}

export default GroupProfile;
