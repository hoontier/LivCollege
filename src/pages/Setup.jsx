//Setup.jsx
import React, { useState, useRef } from 'react';  
import AllClasses from '../components/AllClasses';
import Schedule from '../components/Schedule';
import UserClasses from '../components/UserClasses';
import { signOut, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Setup({ setJustCreated}) {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const formRef = useRef(null);  

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form was submitted");

        if (!name || !lastName || !username) {
            alert("Please fill all the fields!");
            return;
        }

        const user = auth.currentUser;


        try {
            if (user) {
                await updateProfile(user, { displayName: `${name} ${lastName}` });
        
                await updateDoc(doc(db, 'users', user.uid), {
                    name,
                    lastName,
                    username,
                    friendRequests: [],
                    friends: [],
                    incomingFriendRequests: [],
                    outgoingRequests: []
                });

                setJustCreated(false);

                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error updating profile or setting document: ", error);
        }
    }

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
                <button onClick={signOutUser} >Sign Out</button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="setup-form">
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                    Last Name:
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                </label>
                <label>
                    Username:
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <button type="submit">Finish Setup</button>
            </form>

            <AllClasses />
            <UserClasses />
            <Schedule />

            {/* <button onClick={handleButtonClick}>Submit</button>   */}
        </div>
    );
}

export default Setup;

