//Home.jsx
import React from 'react';  
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import UserEvents from '../components/UserEvents';
import CreateGroup from '../components/Groups/CreateGroup';
import DisplayGroups from '../components/Groups/DisplayGroups';

function Home() {

    return (
        <div className="home">
            <Header />
            <DisplayUserClasses />
            <UserEvents />
            <CreateGroup />
            <DisplayGroups />
            <Schedule />
            <Footer />
        </div>
    );
}

export default Home;
