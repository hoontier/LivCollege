import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from './config/firebaseConfig';
import SignIn from './components/SignIn';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';

// Main component.
function App() {
  // State definitions.
  const [classesData, setClassesData] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHonors, setIsHonors] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Fetch all users data from Firestore.
  const fetchUserData = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const data = usersSnapshot.docs.map((userDoc) => ({
      id: userDoc.id,
      ...userDoc.data()
    }));
    setUsers(data);
  };

  // Fetch all classes data from Firestore.
  const fetchClassData = async () => {
    const classSnapshot = await getDocs(collection(db, "classes"));
    const data = classSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setClassesData(data);
  };

  // Fetch a specific user's classes and friends from Firestore.
  const fetchUserDetails = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    const userData = userSnapshot.data();
    setUserClasses(userData.classes || []);
    setUserFriends(userData.friends || []);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(false);

      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);
        const userExists = userSnapshot.exists();
        setIsNewUser(!userExists);

        console.log(`User ${user.uid} exists: ${userExists}`);

        if (!isNewUser) {
          // Fetch class data, user data, and user details (classes and friends).
          fetchClassData();
          fetchUserData();
          fetchUserDetails(user);
        } else {
          console.log(`Creating a new user document for user id: ${user.uid}`);
        }
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe(); // Clean up subscription on component unmount.
  }, []);

  // Function to add a class to a user's classes in Firestore and update the local state.
  const handleAddClass = (data) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const currentClasses = userClasses;

      if (currentClasses.some(classItem => classItem.id === data.id)) {
        console.log('Class already exists in user data.');
        return;
      }

      const updatedClasses = [...currentClasses, data];
      setUserClasses(updatedClasses);
    }
  };

  // Function to remove a class from a user's classes in Firestore and update the local state.
  const handleRemoveClass = (data) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const currentClasses = userClasses;

      const updatedClasses = currentClasses.filter(
        (classItem) => classItem.id !== data.id
      );

      setUserClasses(updatedClasses);
    }
  };

  // Function to add a friend to a user's friends in Firestore and update the local state.
  const handleAddFriend = async (data) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      const userData = userSnapshot.data();
      const currentFriends = userData.friends || [];

      // Prevent duplicates.
      if (currentFriends.some(friend => friend.id === data.id)) {
        console.log('Friend already exists in user data.');
        return;
      }

      const updatedFriends = [...currentFriends, data];
      await setDoc(userDocRef, { ...userData, friends: updatedFriends });

      setUserFriends(updatedFriends);
      fetchUserData(); // Update user data after friend is added.
    }
  };

  // Render the component.
  return (
    <>
      {isLoading ? (
        <SignIn isLoading={isLoading} />
      ) : user ? (
        isNewUser ? (
          <Setup
            classesData={classesData}
            searchTerm={searchTerm}
            isHonors={isHonors}
            selectedDays={selectedDays}
            handleAddClass={handleAddClass}
            daysOfWeek={daysOfWeek}
            setSelectedDays={setSelectedDays}
            setSearchTerm={setSearchTerm}
            setIsHonors={setIsHonors}
            userClasses={userClasses}
            handleRemoveClass={handleRemoveClass}
            setUser={setUser}
          />
        ) : (
          <Dashboard setUser={setUser} userClasses={userClasses} />
        )
      ) : (
        <SignIn isLoading={isLoading} />
      )}
    </>
  );
}

export default App;
