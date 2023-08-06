// App.jsx
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebaseConfig';
import { useDispatch } from 'react-redux';
import { fetchAllClasses, fetchAllUsers, fetchUserDetails } from './features/dataSlice';
import SignIn from './components/SignIn';
import { doc, getDoc } from 'firebase/firestore';
import { updateFriendsData } from './features/friendsSlice';
import Dashboard from './pages/Dashboard';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';

function AuthHandler({ setUser }) {
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
        dispatch({ type: 'data/setIsEditingUser', payload: !userExists });

        dispatch(fetchAllClasses());
        dispatch(fetchAllUsers());
        dispatch(fetchUserDetails(user));
        dispatch(updateFriendsData(user));
      } else {
        setUser(null);
        navigate("/signin");
      }
    });
    
    return () => unsubscribe(); 
  }, [dispatch, navigate, setUser]);

  return null;
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AuthHandler setUser={setUser} />
      <Routes>
        <Route path="/signin" element={!user ? <SignIn /> : <Dashboard />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;