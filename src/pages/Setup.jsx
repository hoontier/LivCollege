import React, { useState, useEffect } from "react";
import AllClasses from "../components/AllClasses";
import UserClasses from "../components/UserClasses";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import styles from "../styles/Setup.module.css";
import Schedule from "../components/Schedule";

const Setup = ({ classesData, searchTerm, isHonors, selectedDays, handleAddClass, daysOfWeek, setSelectedDays, setSearchTerm, setIsHonors, userClasses, handleRemoveClass, setUser}) => {
    const [username, setUsername] = useState('');
    const [preferredName, setPreferredName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUsername(data.username || '');
                } 
            } 
        });

        return () => unsubscribe();
    }, []);

    const signOutUser = () => {
        signOut(auth).then(() => {
            console.log("Sign-out successful.");
            setUser(null); // Set user to null when signed out
        }).catch((error) => {
            console.error("An error happened during sign-out:", error);
        });
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const submitForm = async (e) => {
        e.preventDefault();

        await setDoc(doc(db, "users", auth.currentUser.uid), {
            username: username,
            name: preferredName,
            lastName: lastName,
            classes: userClasses, // Add the current userClasses state to Firestore.
            friends: [],
            friendRequests: [],
            outgoingRequests: [],
        }, { merge: true });

        console.log("Account details saved!");

        window.location.reload(); // Refresh the page
    }

    return (
      <>
        <div className={styles.setupHeader}>
          <button onClick={signOutUser} className={styles.signOut}>Sign Out</button>
        </div>
        <form onSubmit={submitForm}>
          <label>
              Username:
              <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
          <label>
              Preferred Name:
              <input type="text" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
          </label>
          <label>
              Last Name:
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label>
        </form>
          
        <AllClasses
          classesData={classesData}
          searchTerm={searchTerm}
          isHonors={isHonors}
          selectedDays={selectedDays}
          handleAddClass={handleAddClass}
          daysOfWeek={daysOfWeek}
          setSelectedDays={setSelectedDays}
          setSearchTerm={setSearchTerm}
          setIsHonors={setIsHonors}
        />
        <UserClasses
          userClasses={userClasses}
          handleRemoveClass={handleRemoveClass}
        />
        <Schedule classes={userClasses} />
        <button onClick={submitForm}>Save</button>
      </>
    );
}

export default Setup;
