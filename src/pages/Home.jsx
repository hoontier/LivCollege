import React, { useState } from 'react';  
import Header from '../components/HeaderAndFooter/Header';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import UserRecurringEvents from '../components/Events/UserRecurringEvents';
import UserOccasionalEvents from '../components/Events/UserOccasionalEvents';
import FriendsAndClasses from '../components/Friends/FriendsAndClasses';
import styles from '../styles/Home.module.css';

function Home() {
    const [viewType, setViewType] = useState('schedule');

    return (
        <div className={styles['home-wrapper']}>
            <Header className={styles['homeHeader']}/>

            <div className={styles['groups']}>
                <h1>groups</h1>
            </div>
            <div className={styles['friends']}>
                <FriendsAndClasses />
            </div>
            <div className={styles['main-area']}>
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
