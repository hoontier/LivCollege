// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { updateProfile } from 'firebase/auth';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../components/HeaderAndFooter/Header';
import Footer from '../components/HeaderAndFooter/Footer';

function EditProfile () {
    const currentUser = useSelector(state => state.data.user);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const navigate = useNavigate();

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
                    if (!bio && currentUser?.bio) setBio(currentUser.bio);
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
        
        if (!bio && !currentUser.bio) {
            alert("Please fill in the bio!");
            return;
        }

        const user = auth.currentUser;


        try {
            if (user) {
                const finalName = name || currentUser.name;
                const finalLastName = lastName || currentUser.lastName;
                const finalUsername = username || currentUser.username;
                const finalBio = bio || currentUser.bio; // Add this line
                
                await updateProfile(user, { displayName: `${finalName} ${finalLastName}` });
                
                await updateDoc(doc(db, 'users', user.uid), {
                    name: finalName,
                    lastName: finalLastName,
                    username: finalUsername,
                    bio: finalBio, 
                });      

                navigate('/home');
            }
        } catch (error) {
            console.error("Error updating profile or setting document: ", error);
        }
    }

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit} className="setup-form">
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
                <label>
                    {/* TODO: Indicate max characters somewhere */}
                    Bio:
                    <textarea 
                        maxLength="200"
                        value={bio} 
                        placeholder={"World's preview"}  
                        onChange={e => setBio(e.target.value)} 
                    />
                </label>
                <button type="submit">Save and Return Home</button>
            </form>
            <Footer />
        </div>
    );
}

export default EditProfile;
