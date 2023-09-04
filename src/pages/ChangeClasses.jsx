import React from 'react';
import Header from '../components/Header/Header';
import AllClasses from '../components/Classes/AllClasses';
import UserClasses from '../components/Classes/UserClasses';
import Schedule from '../components/Schedule';
import { useNavigate } from 'react-router-dom';

const ChangeClasses = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home');
    }
    
    return (
        <div>
            <Header />
            <AllClasses />
            <UserClasses />
            <button onClick={handleClick}>
                Save and Return Home
            </button>
            <Schedule />
        </div>
    );
}

export default ChangeClasses;
