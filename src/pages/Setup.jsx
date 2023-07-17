import React, { useState, useEffect } from "react";
import AllClasses from "../components/AllClasses";
import UserClasses from "../components/UserClasses";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
import styles from "../styles/Setup.module.css";
import Schedule from "../components/Schedule";


const Setup = ({ classesData, searchTerm, isHonors, selectedDays, handleAddClass, daysOfWeek, setSelectedDays, setSearchTerm, setIsHonors, userClasses, handleRemoveClass, setUser}) => {
    const [hasAccountDetails, setHasAccountDetails] = useState(false);
    const [username, setUsername] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log('User:', user);
          const credential = GoogleAuthProvider.credentialFromResult(user);
          console.log('Credential:', credential);
  
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const data = docSnap.data();
            setUsername(data.username || '');
            setIsPrivate(data.private || false);
            setHasAccountDetails(!!data.username);  // Check if username has already been set
          } else {
            console.log("No such document!");
          }
  
        } else {
          console.log('No user is signed in.');
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
    
      const handlePrivateChange = (e) => {
        setIsPrivate(e.target.checked);
      }
    
      const submitForm = async (e) => {
        e.preventDefault();
    
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          username: username,
          private: isPrivate,
        }, { merge: true });
    
        setHasAccountDetails(true);  // Update flag once account details are saved
    
        console.log("Account details saved!");
      }
    

    return (
    <>
        <div className={styles.setupHeader}>
          <button onClick={signOutUser} className={styles.signOut}>Sign Out</button>
        </div>
        
        {auth.currentUser && !hasAccountDetails && (
            <form onSubmit={submitForm}>
            <label>
                Username:
                <input type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <label>
                Private Account:
                <input type="checkbox" checked={isPrivate} onChange={handlePrivateChange} />
            </label>
            <input type="submit" value="Save" />
            </form>
        )}
        
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
    </>
    );
}

export default Setup;