import React, { useState } from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import Header from '../components/HeaderAndFooter/Header';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import UserRecurringEvents from '../components/Events/UserRecurringEvents';
import UserOccasionalEvents from '../components/Events/UserOccasionalEvents';
import FriendsAndClasses from '../components/Friends/FriendsAndClasses';
import FriendClasses from '../components/Friends/FriendClasses';
import FriendProfile from '../components/Friends/FriendProfile';
import DisplayGroups from '../components/Groups/DisplayGroups';
import AllGroups from '../components/Groups/AllGroups';
import GroupProfile from './GroupProfile';
import { unselectFriend } from '../features/friendsSlice';
import { useDispatch } from 'react-redux';

function Home() {
    const [viewType, setViewType] = useState('schedule');
    const [groupList, setGroupList] = useState('user');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const dispatch = useDispatch();

    const handleCloseFriendProfile = () => {
        setSelectedFriend(null);
        dispatch(unselectFriend());
    };

    return (
        <Container fluid className="p-0 h-100">
            <Row noGutters className="h-100">
                <Col lg={1} className="bg-secondary p-3">
                    <ButtonGroup vertical>
                        <Button variant="light" onClick={() => setGroupList('user')}>User Groups</Button>
                        <Button variant="light" onClick={() => setGroupList('all')}>All Groups</Button>
                    </ButtonGroup>
                    {groupList === 'user' && <DisplayGroups onSelectGroup={setSelectedGroup} />}
                    {groupList === 'all' && <AllGroups onSelectGroup={setSelectedGroup} />}
                    <FriendsAndClasses onSelectFriend={setSelectedFriend} />
                </Col>
                <Col lg={10} className="bg-light p-3">
                    {selectedFriend && <FriendProfile friendId={selectedFriend} onClose={handleCloseFriendProfile} />}
                    {selectedGroup && <GroupProfile groupId={selectedGroup} onClose={setSelectedGroup} />}
                    <ButtonGroup>
                        <Button variant="light" onClick={() => setViewType('schedule')}>Schedule View</Button>
                        <Button variant="light" onClick={() => setViewType('table')}>Table View</Button>
                    </ButtonGroup>
                    {viewType === 'schedule' && <Schedule />}
                    {viewType === 'table' && (
                        <>
                            <DisplayUserClasses />
                            <UserRecurringEvents />
                            {selectedFriend && <FriendClasses friend={selectedFriend} />}
                        </>
                    )}
                </Col>
                <Col lg={1} className="bg-secondary p-3">
                    <UserOccasionalEvents />
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
