//Setup.jsx
import React, { useState, useRef, useEffect } from 'react';  
import { useSelector } from 'react-redux'; 
import AllClasses from '../components/AllClasses';
import Schedule from '../components/Schedule';
import UserClasses from '../components/UserClasses';
import { signOut, updateProfile } from 'firebase/auth';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Setup({ setJustCreated }) {
    const currentUser = useSelector(state => state.data.user);

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    

    const navigate = useNavigate();
    const formRef = useRef(null);  

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;

            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    if (!name && currentUser?.name) setName(currentUser.name);
                    if (!lastName && currentUser?.lastName) setLastName(currentUser.lastName);
                    if (!username && currentUser?.username) setUsername(currentUser.username);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form was submitted");

        if (!name && !currentUser.name) {
            alert("Please fill in the name!");
            return;
        }
        
        if (!lastName && !currentUser.lastName) {
            alert("Please fill in the last name!");
            return;
        }
        
        if (!username && !currentUser.username) {
            alert("Please fill in the username!");
            return;
        }
        

        const user = auth.currentUser;


        try {
            if (user) {
                const finalName = name || currentUser.name;
                const finalLastName = lastName || currentUser.lastName;
                const finalUsername = username || currentUser.username;
                
                await updateProfile(user, { displayName: `${finalName} ${finalLastName}` });
                
                await updateDoc(doc(db, 'users', user.uid), {
                    name: finalName,
                    lastName: finalLastName,
                    username: finalUsername,
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
                    Preferred Name:
                    <input 
                        type="text" 
                        value={name} 
                        placeholder={"Your pals' cue"}  
                        onChange={e => setName(e.target.value)} 
                    />
                </label>
                <label>
                    Last Name:
                    <input 
                        type="text" 
                        value={lastName} 
                        placeholder={'Family glue'}  
                        onChange={e => setLastName(e.target.value)} 
                    />
                </label>
                <label>
                    Username:
                    <input 
                        type="text" 
                        value={username} 
                        placeholder={"Online you"}  
                        onChange={e => setUsername(e.target.value)} 
                    />
                </label>
                <button type="submit">Finish Setup</button>
            </form>

            <AllClasses />
            <UserClasses />
            <Schedule />

        </div>
    );
}

export default Setup;

