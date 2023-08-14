//App.jsx
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebaseConfig';
import { useDispatch } from 'react-redux';
import { fetchAllUsers, fetchUserDetails } from './features/dataSlice';
import SignIn from './components/SignIn';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateFriendsData } from './features/friendsSlice';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Friends from './pages/Friends';
import FriendProfile from './pages/FriendProfile';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

function AuthHandler({ setUser, setIsEditingUser, setJustCreated, justCreated }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();


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
            name: "",
            username: "",  // You might want to set this somehow
            friendRequests: [],
            friends: [],
            incomingFriendRequests: [],
            outgoingRequests: []
          });
          setJustCreated(true);
          navigate('/setup'); // Direct user to the setup page after creating a doc for them
        } else if (!justCreated && location.pathname !== "/setup" && location.pathname !== "/friends" && !location.pathname.startsWith('/friend/')) {
          setIsEditingUser(false);
          navigate('/home'); 
        } else {
          setJustCreated(false); 
        }

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
          <Route path="/home" element={<Home />} />
          <Route path="/setup" element={<Setup justCreated={justCreated} setJustCreated={setJustCreated} />} />
          <Route path="/friends" element={<Friends />} /> 
          <Route path="/friend/:friendId" element={<FriendProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
