import React from 'react';
import AllClasses from '../Classes/AllClasses';
import UserClasses from '../Classes/UserClasses';
import Schedule from '../Schedule';

const SetupClasses = ({ onBack, onNext }) => {
    return (
        <div>
            <AllClasses />
            <UserClasses />
            <div>
                <button onClick={onBack}>Edit Personal Info</button>
                <button onClick={onNext}>Continue Setup</button>
            </div>
            <Schedule />
        </div>
    );
}

export default SetupClasses;
