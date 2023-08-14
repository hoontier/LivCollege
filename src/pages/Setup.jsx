// Setup.jsx
import React, {useState, useEffect} from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import AllClasses from '../components/Classes/AllClasses';
import Schedule from '../components/Schedule';
import UserClasses from '../components/Classes/UserClasses';
import SetupFriends from '../components/Friends/SetupFriends';
import SetupPersonalInfo from '../components/SetupPersonalInfo';

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
                <>
                    <AllClasses />
                    <UserClasses onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />
                    <Schedule />
                </>
            )}
            {currentStep === 3 && (
                <SetupFriends onBack={() => setCurrentStep(2)} onNext={() => navigate('/home')} />
            )}
        </div>
    );
}


export default Setup;
