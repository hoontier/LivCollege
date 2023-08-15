//GroupsList.jsx
import React, { useState } from 'react';
import Header from '../components/HeaderAndFooter/Header';
import DisplayGroups from '../components/Groups/DisplayGroups';
import Footer from '../components/HeaderAndFooter/Footer';
import CreateGroup from '../components/Groups/CreateGroup';
import GroupInvites from '../components/Groups/GroupInvites';
import AllGroups from '../components/Groups/AllGroups';

const GroupsList = () => {
    // Define a state to determine if CreateGroup should be visible
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    return (
        <div>
            <Header />

            {/* Button to toggle CreateGroup's visibility */}
            <button onClick={() => setShowCreateGroup(prev => !prev)}>
                {showCreateGroup ? "Hide Create Group" : "Show Create Group"}
            </button>

            {/* Conditionally render CreateGroup based on the state */}
            {showCreateGroup && <CreateGroup />}
            <AllGroups />
            <DisplayGroups />
            <GroupInvites />
            <Footer />
        </div>
    )
}

export default GroupsList;
