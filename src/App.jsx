//App.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from './config/firebaseConfig';
import { setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { fetchAllUsers, fetchUserDetails } from './features/dataSlice';
import SignIn from './components/SignIn';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateFriendsData } from './features/friendsSlice';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Friends from './pages/Friends';
import FriendProfile from './pages/FriendProfile';
import UserProfile from './pages/UserProfile';
import ChangeClasses from './pages/ChangeClasses';
import EditProfile from './pages/EditProfile';
import GroupsList from './pages/GroupsList';
import GroupProfile from './pages/GroupProfile';
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
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
      })
      .catch(err => {
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      dispatch({ type: 'data/setLoading', payload: true });

      if (user) {

        setUser(user);
        const { uid, email, displayName, photoURL } = user;


        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
        const userExists = userSnapshot.exists();


        if (!userExists) {

          setIsEditingUser(true);
          await setDoc(userDocRef, {
            lastName: "",
            name: "",
            username: "",
            friendRequests: [],
            friends: [],
            incomingFriendRequests: [],
            outgoingRequests: [],
            groups: [],
          });
          setJustCreated(true);
          navigate('/setup');
        } else {

          if (user.photoURL) {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                photoURL: user.photoURL,
            }, { merge: true });
          }

          dispatch({ type: 'data/setUser', payload: { uid, email, displayName, photoURL } });

          if (!justCreated && location.pathname !== "/setup"
              && location.pathname !== "/friends"
              && !location.pathname.startsWith('/friend/')
              && !location.pathname.startsWith('/change-classes')
              && !location.pathname.startsWith('/edit-profile')
              && !location.pathname.startsWith('/user/')
              && !location.pathname.startsWith('/groups')
              && !location.pathname.startsWith('/group/')) {
            setIsEditingUser(false);
            navigate('/home');
          } else {
            setJustCreated(false);
          }
        }

        dispatch(fetchAllUsers());
        dispatch(fetchUserDetails(user));
        dispatch(updateFriendsData(user));
      } else {
        setUser(null);
        setIsEditingUser(false);
        navigate("/signin");
      }
    });

    return () => unsubscribe();
    return () => {
      unsubscribe();
    }; 
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
          <Route path="/change-classes" element={<ChangeClasses />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/group/:groupId" element={<GroupProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
