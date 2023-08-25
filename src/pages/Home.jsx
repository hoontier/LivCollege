import React, { useState } from 'react';  
import Header from '../components/HeaderAndFooter/Header';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import UserRecurringEvents from '../components/Events/UserRecurringEvents';
import UserOccasionalEvents from '../components/Events/UserOccasionalEvents';
import FriendsAndClasses from '../components/Friends/FriendsAndClasses';
import FriendClasses from '../components/Friends/FriendClasses';
import FriendProfile from '../components/Friends/FriendProfile';
import styles from '../styles/Home.module.css';
import { unselectFriend } from '../features/friendsSlice';
import { useDispatch } from 'react-redux';

function Home() {
    const [viewType, setViewType] = useState('schedule');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const dispatch = useDispatch();

    const handleCloseFriendProfile = () => {
        setSelectedFriend(null); 
        dispatch(unselectFriend());
    }



    return (
        <div className={styles['home-wrapper']}>
            <Header className={styles['homeHeader']}/>

            <div className={styles['groups']}>
                <h1>groups</h1>
            </div>
            <div className={styles['friends']}>
                <FriendsAndClasses onSelectFriend={setSelectedFriend} />
            </div>
            <div className={styles['main-area']}>
                {/* Friend Profile View */}
                {selectedFriend && <FriendProfile friendId={selectedFriend} onClose={handleCloseFriendProfile} />}

                
                {/* Toggle Buttons */}
                <div className={styles['toggle-buttons']}>
                    <button onClick={() => setViewType('schedule')}>Schedule View</button>
                    <button onClick={() => setViewType('table')}>Table View</button>
                </div>

                {/* Schedule View */}
                {viewType === 'schedule' && <Schedule />}
                
                {/* Table View */}
                {viewType === 'table' && (
                    <>
                        <DisplayUserClasses />
                        <UserRecurringEvents />
                        {selectedFriend && (
                            <FriendClasses friend={selectedFriend} />
                        )}
                    </>
                )}
            </div>

            <div className={styles['events']}>
                <UserOccasionalEvents />
            </div>
        </div>
    );
}

export default Home;
