//App.jsx
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebaseConfig';
import { useDispatch } from 'react-redux';
import { fetchAllClasses, fetchAllUsers, fetchUserDetails } from './features/dataSlice';
import SignIn from './components/SignIn';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateFriendsData } from './features/friendsSlice';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';

function AuthHandler({ setUser, setIsEditingUser, setJustCreated, justCreated }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'data/setLoading', payload: true });
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch({ type: 'data/setLoading', payload: false });

      if (user) {
        setUser(user);
        const { uid, email, displayName, photoURL } = user;
        dispatch({ type: 'data/setUser', payload: { uid, email, displayName, photoURL } });

        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
        const userExists = userSnapshot.exists();
        if (!userExists) {
          setIsEditingUser(true);

          // Create a new document for the user in Firestore
          await setDoc(userDocRef, {
            lastName: "",  // Empty because it doesn't seem you have it in auth
            name: displayName,
            username: "",  // You might want to set this somehow
            friendRequests: [],
            friends: [],
            incomingFriendRequests: [],
            outgoingRequests: []
          });
          setJustCreated(true);
          navigate('/setup'); // Direct user to the setup page after creating a doc for them
        } else if (!justCreated) {
            setIsEditingUser(false);
            navigate('/dashboard'); // Direct user to the dashboard
        } else {
            setJustCreated(false);  // Reset for future uses
        }

        dispatch(fetchAllClasses());
        dispatch(fetchAllUsers());
        dispatch(fetchUserDetails(user));
        dispatch(updateFriendsData(user));
      } else {
        setUser(null);
        setIsEditingUser(false);
        navigate("/signin"); // Direct unauthenticated users to signin
      }
    });
    
    return () => unsubscribe(); 
  }, [dispatch, navigate, setUser]);

  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [justCreated, setJustCreated] = useState(false);


  return (
    <Router>
      <AuthHandler setUser={setUser} setIsEditingUser={setIsEditingUser} justCreated={justCreated} setJustCreated={setJustCreated} />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<Setup />} />
      </Routes>
    </Router>
  );
}

export default App;
