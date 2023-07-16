import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from './config/firebaseConfig';
import SignIn from './components/SignIn';
// import AllClasses from './components/AllClasses';
// import UserClasses from './components/UserClasses';
import Setup from './pages/Setup';
// import Users from './components/Users';
// import UserFriends from './components/UserFriends';

// Predefined constants for days of the week.
const daysOfWeek = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
];

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
  

  // Fetch all users data from Firestore.
  const fetchUserData = async () => {
    const data = [];
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);

    userSnapshot.docs.forEach((userDoc) => {
      const userData = userDoc.data();
      data.push({ id: userDoc.id, ...userData });
    });

    setUsers(data);
  };

  // Fetch all classes data from Firestore.
  const fetchClassData = async () => {
    const data = [];
    const classCollection = collection(db, "classes");
    const classSnapshot = await getDocs(classCollection);

    classSnapshot.docs.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

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
    // On authentication state change (i.e. sign in or sign out).
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(false);

      if (user) {
        setUser(user);
        // Update user's name in Firestore, if user is signed in.
        await setDoc(doc(db, "users", user.uid), { name: user.displayName }, { merge: true });
        // Fetch class data, user data, and user details (classes and friends).
        fetchClassData();
        fetchUserData();
        fetchUserDetails(user);
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe(); // Clean up subscription on component unmount.
  }, []);

  // Function to add a class to a user's classes in Firestore and update the local state.
  const handleAddClass = async (data) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      const userData = userSnapshot.data();
      const currentClasses = userData.classes || [];

      // Prevent duplicates.
      if (currentClasses.some(classItem => classItem.id === data.id)) {
        console.log('Class already exists in user data.');
        return;
      }

      const updatedClasses = [...currentClasses, data];
      await setDoc(userDocRef, { ...userData, classes: updatedClasses });

      setUserClasses(updatedClasses);
      fetchUserData(); // Update user data after class is added.
    }
  };

  // Function to remove a class from a user's classes in Firestore and update the local state.
  const handleRemoveClass = async (data) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      const userData = userSnapshot.data();
      const currentClasses = userData.classes || [];

      const updatedClasses = currentClasses.filter(
        (classItem) => classItem.id !== data.id
      );

      await setDoc(userDocRef, { ...userData, classes: updatedClasses });

      setUserClasses(updatedClasses);
      fetchUserData(); // Update user data after class is removed.
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
      <h1>ClassMate</h1>
      {user ? (
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
        <SignIn isLoading={isLoading} />
      )}
    </>
  );
}

export default App;
