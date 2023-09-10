import React, { useState } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import Header from '../components/Header/Header';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import UserRecurringEvents from '../components/Events/UserRecurringEvents';
import UserOccasionalEvents from '../components/Events/UserOccasionalEvents';
import UsersAndRequests from '../components/Friends/UsersAndRequests';
import FriendsAndClasses from '../components/Friends/FriendsAndClasses';
import FriendClasses from '../components/Friends/FriendClasses';
import FriendProfile from '../components/Friends/FriendProfile';
import DisplayGroups from '../components/Groups/DisplayGroups';
import AllGroups from '../components/Groups/AllGroups';
import GroupProfile from './GroupProfile';
import { unselectFriend } from '../features/friendsSlice';
import { useDispatch } from 'react-redux'
import styles from '../styles/Home.module.css'
import classNames from 'classnames';

const Home = () => {
    const [viewType, setViewType] = useState('schedule');
    const [groupList, setGroupList] = useState('user');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showUsersAndRequests, setShowUsersAndRequests] = useState(false);


    const dispatch = useDispatch();

    const handleCloseFriendProfile = () => {
        setSelectedFriend(null);
        dispatch(unselectFriend());
    };

    return (
        <div className={styles['home-wrapper']}>
            <Header className={styles['homeHeader']}/>

            <div className={
                classNames(
                "rounded border p-2 ")
        }>
                <div className={styles['toggle-buttons']}>
                    <button onClick={() => setGroupList('user')}>User Groups</button>
                    <button onClick={() => setGroupList('all')}>All Groups</button>
                </div>
                {groupList === 'user' && <DisplayGroups onSelectGroup={setSelectedGroup} />}
                {groupList === 'all' && <AllGroups onSelectGroup={setSelectedGroup}/>}
            </div>
            <div className={styles['friends']}>
                <FriendsAndClasses onSelectFriend={setSelectedFriend} onManageFriendsClick={setShowUsersAndRequests} /> 
            </div>
            <div className={styles['main-area']}>
                {selectedFriend && <FriendProfile friendId={selectedFriend} onClose={handleCloseFriendProfile} />}
                {selectedGroup && <GroupProfile groupId={selectedGroup} onClose={setSelectedGroup}/>}
                
                {showUsersAndRequests ? (
                    // If showUsersAndRequests is true, only show UsersAndRequests
                    <UsersAndRequests onHide={() => setShowUsersAndRequests(false)} />
                ) : (
                    // Else, show the toggle buttons, schedule, and table
                    <>
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
                    </>
                )}
            </div>

            <div className={styles['events']}>
                <UserOccasionalEvents />
            </div>

            <div className={styles['chat']}>
                <h1>Chat -- Coming Soon </h1>
            </div>
        </div>
    );
}

export default Home;
