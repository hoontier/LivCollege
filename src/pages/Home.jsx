//Home.jsx
import React from 'react';  
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/Classes/DisplayUserClasses';
import AddRecurringEvent from '../components/AddRecurringEvent';

function Home() {

    return (
        <div className="home">
            <Header />
            <DisplayUserClasses />
            <Schedule />
            <AddRecurringEvent />
            <Footer />
        </div>
    );
}

export default Home;
