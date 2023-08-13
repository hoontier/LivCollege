//Home.jsx
import React from 'react';  
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';
import Schedule from '../components/Schedule';
import DisplayUserClasses from '../components/DisplayUserClasses';

function Home() {

    return (
        <div className="home">
            <Header />
            <DisplayUserClasses />
            <Schedule />
            <Footer />
        </div>
    );
}

export default Home;
