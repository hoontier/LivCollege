import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebaseConfig';
import SignIn from './components/SignIn';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Main component.
function App() {
  // State definitions.
  const [classesData, setClassesData] = useState([]);
  const [userClasses, setUserClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHonors, setIsHonors] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [userFriendRequests, setUserFriendRequests] = useState([]);
  const [userOutgoingRequests, setUserOutgoingRequests] = useState([]);

  // Fetch all users data from Firestore.
  const fetchUserData = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const data = usersSnapshot.docs.map((userDoc) => ({
      id: userDoc.id,
      ...userDoc.data(),
    }));
    setUsers(data);
  };

  // Fetch all classes data from Firestore.
  const fetchClassData = async () => {
    const classSnapshot = await getDocs(collection(db, 'classes'));
    const data = classSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClassesData(data);
  };

  // Fetch a specific user's classes and friends from Firestore.
  const fetchUserDetails = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);
    const userData = userSnapshot.data();
    setUserClasses(userData.classes || []);
    setUserFriends(userData.friends || []);
    setUserFriendRequests(userData.friendRequests || []); // Fetch user's friend requests
    setUserOutgoingRequests(userData.outgoingRequests || []); // Fetch user's outgoing requests
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      setIsLoading(false);

      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
        const userExists = userSnapshot.exists();
        setIsEditingUser(!userExists);

        console.log(`User ${user.uid} exists: ${userExists}`);

        if (!isEditingUser) {
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

      if (currentClasses.some((classItem) => classItem.id === data.id)) {
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

      const updatedClasses = currentClasses.filter((classItem) => classItem.id !== data.id);

      setUserClasses(updatedClasses);
    }
  };
  // Function to add a friend to a user's friends in Firestore and update the local state.
// Add a friend request.
const handleAcceptRequest = async (sender) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    // Fetch currentUserData first
    const currentUserDocRef = doc(db, "users", currentUser.uid);
    const currentUserSnapshot = await getDoc(currentUserDocRef);
    const currentUserData = currentUserSnapshot.data();

    // Add sender to currentUser's friends array and remove from friendRequests array.
    const currentUserFriends = currentUserData.friends || [];
    const currentUserFriendRequests = currentUserData.friendRequests || [];

    if (!currentUserFriends.some(friend => friend.id === sender.id)) {
      currentUserFriends.push({
        id: sender.id,
        name: sender.name,
        lastName: sender.lastName,
        username: sender.username
      });
      const updatedFriendRequests = currentUserFriendRequests.filter(request => request.id !== sender.id);
      await setDoc(currentUserDocRef, { ...currentUserData, friends: currentUserFriends, friendRequests: updatedFriendRequests });

      setUserFriends(currentUserFriends);
      setUserFriendRequests(updatedFriendRequests);
    }

    // Add currentUser to sender's friends array and remove from sender's outgoingRequests array.
    const senderDocRef = doc(db, "users", sender.id);
    const senderSnapshot = await getDoc(senderDocRef);
    const senderData = senderSnapshot.data();
    const senderFriends = senderData.friends || [];
    const senderOutgoingRequests = senderData.outgoingRequests || [];

    if (!senderFriends.some(friend => friend.id === currentUser.uid)) {
      senderFriends.push({
        id: currentUser.uid,
        name: currentUserData.name,
        lastName: currentUserData.lastName,
        username: currentUserData.username
      });
      const updatedOutgoingRequests = senderOutgoingRequests.filter(request => request.id !== currentUser.uid);
      await setDoc(senderDocRef, { ...senderData, friends: senderFriends, outgoingRequests: updatedOutgoingRequests });
    }
  }
};

const handleFriendRequest = async (targetUser) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    // Fetch currentUserData first
    const currentUserDocRef = doc(db, "users", currentUser.uid);
    const currentUserSnapshot = await getDoc(currentUserDocRef);
    const currentUserData = currentUserSnapshot.data();

    // Add request to targetUser's friendRequests array.
    if (currentUser.uid === targetUser.id) {
      console.log('User cannot add themselves as a friend.');
      return;
    }
    const targetUserDocRef = doc(db, "users", targetUser.id);
    const targetUserSnapshot = await getDoc(targetUserDocRef);
    const targetUserData = targetUserSnapshot.data();
    const targetUserFriendRequests = targetUserData.friendRequests || [];
    if (!targetUserFriendRequests.some(request => request.id === currentUser.uid)) {
        targetUserFriendRequests.push({ id: currentUser.uid, name: currentUserData.name, lastName: currentUserData.lastName, username: currentUserData.username });
        await setDoc(targetUserDocRef, { ...targetUserData, friendRequests: targetUserFriendRequests });
    }

    // Add request to currentUser's outgoingRequests array.
    const currentUserOutgoingRequests = currentUserData.outgoingRequests || [];
    if (!currentUserOutgoingRequests.some(request => request.id === targetUser.id)) {
        currentUserOutgoingRequests.push({ id: targetUser.id, name: targetUser.name, lastName: targetUser.lastName, username: targetUser.username });
        await setDoc(currentUserDocRef, { ...currentUserData, outgoingRequests: currentUserOutgoingRequests });

        setUserOutgoingRequests(currentUserOutgoingRequests);
    }
  }
};




// Reject a friend request.
const handleRejectRequest = async (sender) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
      // Remove request from currentUser's friendRequests array.
      const currentUserDocRef = doc(db, "users", currentUser.uid);
      const currentUserSnapshot = await getDoc(currentUserDocRef);
      const currentUserData = currentUserSnapshot.data();
      const currentUserFriendRequests = currentUserData.friendRequests || [];
      const updatedFriendRequests = currentUserFriendRequests.filter(request => request.id !== sender.id);
      await setDoc(currentUserDocRef, { ...currentUserData, friendRequests: updatedFriendRequests });

      setUserFriendRequests(updatedFriendRequests);

      // Remove request from sender's outgoingRequests array.
      const senderDocRef = doc(db, "users", sender.id);
      const senderSnapshot = await getDoc(senderDocRef);
      const senderData = senderSnapshot.data();
      const senderOutgoingRequests = senderData.outgoingRequests || [];
      const updatedOutgoingRequests = senderOutgoingRequests.filter(request => request.id !== currentUser.uid);
      await setDoc(senderDocRef, { ...senderData, outgoingRequests: updatedOutgoingRequests });
  }
};

// Cancel a friend request.
const handleCancelRequest = async (receiver) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
      // Remove request from currentUser's outgoingRequests array.
      const currentUserDocRef = doc(db, "users", currentUser.uid);
      const currentUserSnapshot = await getDoc(currentUserDocRef);
      const currentUserData = currentUserSnapshot.data();
      const currentUserOutgoingRequests = currentUserData.outgoingRequests || [];
      const updatedOutgoingRequests = currentUserOutgoingRequests.filter(request => request.id !== receiver.id);
      await setDoc(currentUserDocRef, { ...currentUserData, outgoingRequests: updatedOutgoingRequests });

      setUserOutgoingRequests(updatedOutgoingRequests);

      // Remove request from receiver's friendRequests array.
      const receiverDocRef = doc(db, "users", receiver.id);
      const receiverSnapshot = await getDoc(receiverDocRef);
      const receiverData = receiverSnapshot.data();
      const receiverFriendRequests = receiverData.friendRequests || [];
      const updatedFriendRequests = receiverFriendRequests.filter(request => request.id !== currentUser.uid);
      await setDoc(receiverDocRef, { ...receiverData, friendRequests: updatedFriendRequests });
  }
};


  // Render the component.
return (
    <Router>
        <Routes>
            <Route path="/signin" element={
                isLoading || !user ? 
                <SignIn isLoading={isLoading} /> 
                : <Navigate to="/dashboard" />
            }/>
            <Route path="/dashboard" element={
                user ? (isEditingUser ? <Navigate to="/setup" /> :
                    <Dashboard
                        setUser={setUser}
                        userClasses={userClasses}
                        users={users}
                        userFriends={userFriends}
                        userFriendRequests={userFriendRequests}
                        userOutgoingRequests={userOutgoingRequests}
                        handleFriendRequest={handleFriendRequest}
                        handleAcceptRequest={handleAcceptRequest}
                        handleRejectRequest={handleRejectRequest}
                        handleCancelRequest={handleCancelRequest}
                        setIsEditingUser={setIsEditingUser}
                    />)
                : <Navigate to="/signin" />
            }/>
            <Route path="/setup" element={
                user && isEditingUser ? (
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
                        setIsEditingUser={setIsEditingUser}
                    />
                ) : <Navigate to="/dashboard" />
            }/>
            <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
    </Router>
);
}

export default App;
