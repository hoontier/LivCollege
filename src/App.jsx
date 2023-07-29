// App.jsx
import React, { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './config/firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllClasses, fetchAllUsers, fetchUserDetails } from './features/dataSlice';
import SignIn from './components/SignIn';
import { doc, getDoc } from 'firebase/firestore';
import Schedule from './components/Schedule';
import UserClasses from './components/UserClasses';
import AllUsers from './components/AllUsers';
import AllClasses from './components/AllClasses';

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.data.users);
  const allClasses = useSelector((state) => state.data.allClasses);
  const userClasses = useSelector((state) => state.classes.userClasses);
  const user = useSelector((state) => state.data.user);
  const friends = useSelector((state) => state.friends.friends);
  const userIncomingFriendRequests = useSelector((state) => state.friends.userIncomingFriendRequests);
  const userOutgoingFriendRequests = useSelector((state) => state.friends.userOutgoingFriendRequests);
  const isLoading = useSelector((state) => state.data.isLoading);
  const isEditingUser = useSelector((state) => state.data.isEditingUser);

  useEffect(() => {
    dispatch({ type: 'data/setLoading', payload: true });  // <-- set isLoading to true at the beginning
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch({ type: 'data/setLoading', payload: false });
    
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch({ type: 'data/setUser', payload: { uid, email, displayName, photoURL } });
  
        const userDocRef = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDocRef);
        const userExists = userSnapshot.exists();
        dispatch({ type: 'data/setIsEditingUser', payload: !userExists });
  
        dispatch(fetchAllClasses());
        dispatch(fetchAllUsers());
        dispatch(fetchUserDetails(user));
      }
    });
    
    // check if no user is signed in at the start
    if (auth.currentUser === null) {
      dispatch({ type: 'data/setLoading', payload: false });
    }
    
    return () => unsubscribe(); 
  }, [dispatch]);
  

  const signOutUser = () => {
    signOut(auth).then(() => {
        console.log("Sign-out successful.");
        //reload the page
        window.location.reload();
    }).catch((error) => {
        console.error("An error happened during sign-out:", error);
    });
}
  
  

  return (
    <>
      <SignIn />
      <div >
        <button onClick={signOutUser} >Sign Out</button>
      </div>

      <AllUsers />
      <AllClasses />
      <UserClasses />
      <p>User: {JSON.stringify(user)}</p>
      <Schedule />
    </>
  );
}

export default App;
