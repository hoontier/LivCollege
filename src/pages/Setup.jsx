// Setup.jsx
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import SetupPersonalInfo from '../components/Setup/SetupPersonalInfo';
import SetupClasses from '../components/Setup/SetupClasses';
import SetupFriends from '../components/Setup/SetupFriends';

function Setup({ setJustCreated }) {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();

    const signOutUser = () => {
        signOut(auth).then(() => {
            navigate("/signin");
        }).catch((error) => {
            console.error("An error happened during sign-out:", error);
        });
    }


    return (
        <div className="setup">
            <div>
                <button onClick={signOutUser}>Sign Out</button>
            </div>

            {currentStep === 1 && (
                <SetupPersonalInfo setJustCreated={setJustCreated} onNext={() => setCurrentStep(2)} />
            )}
            {currentStep === 2 && (
                <SetupClasses onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />
            )}
            {currentStep === 3 && (
                <SetupFriends onBack={() => setCurrentStep(2)} onNext={() => navigate('/home')} />
            )}
        </div>
    );
}


export default Setup;
