//friendsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import { fetchUserDetails } from './dataSlice';


export const acceptRequest = createAsyncThunk(
  'friends/acceptRequest',
  async (sender, { dispatch }) => {
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
  
        // Dispatch an action to update the state in the store
        dispatch(setUserFriends(currentUserFriends));
        dispatch(setUserFriendRequests(updatedFriendRequests));
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
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friends/sendFriendRequest',
  async (targetUser, { dispatch }) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Fetch currentUserData first
      const currentUserDocRef = doc(db, "users", currentUser.uid);
      const currentUserSnapshot = await getDoc(currentUserDocRef);
      const currentUserData = currentUserSnapshot.data();

      // Check if targetUser is already a friend. If true, return
      const currentUserFriends = currentUserData.friends || [];
      if (currentUserFriends.some(friend => friend.id === targetUser.id)) {
        console.log('This user is already your friend.');
        return;
      }

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
  
          // Dispatch an action to update the state in the store
          dispatch(setUserOutgoingRequests(currentUserOutgoingRequests));
      }
    }
  }
);


export const rejectRequest = createAsyncThunk(
  'friends/rejectRequest',
  async (sender, { dispatch }) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        // Remove request from currentUser's friendRequests array.
        const currentUserDocRef = doc(db, "users", currentUser.uid);
        const currentUserSnapshot = await getDoc(currentUserDocRef);
        const currentUserData = currentUserSnapshot.data();
        const currentUserFriendRequests = currentUserData.friendRequests || [];
        const updatedFriendRequests = currentUserFriendRequests.filter(request => request.id !== sender.id);
        await setDoc(currentUserDocRef, { ...currentUserData, friendRequests: updatedFriendRequests });
  
        // Dispatch an action to update the state in the store
        dispatch(setUserFriendRequests(updatedFriendRequests));
  
        // Remove request from sender's outgoingRequests array.
        const senderDocRef = doc(db, "users", sender.id);
        const senderSnapshot = await getDoc(senderDocRef);
        const senderData = senderSnapshot.data();
        const senderOutgoingRequests = senderData.outgoingRequests || [];
        const updatedOutgoingRequests = senderOutgoingRequests.filter(request => request.id !== currentUser.uid);
        await setDoc(senderDocRef, { ...senderData, outgoingRequests: updatedOutgoingRequests });
    }
  }
);

export const cancelRequest = createAsyncThunk(
  'friends/cancelRequest',
  async (receiver, { dispatch }) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
        // Remove request from currentUser's outgoingRequests array.
        const currentUserDocRef = doc(db, "users", currentUser.uid);
        const currentUserSnapshot = await getDoc(currentUserDocRef);
        const currentUserData = currentUserSnapshot.data();
        const currentUserOutgoingRequests = currentUserData.outgoingRequests || [];
        const updatedOutgoingRequests = currentUserOutgoingRequests.filter(request => request.id !== receiver.id);
        await setDoc(currentUserDocRef, { ...currentUserData, outgoingRequests: updatedOutgoingRequests });
  
        // Dispatch an action to update the state in the store
        dispatch(setUserOutgoingRequests(updatedOutgoingRequests));
  
        // Remove request from receiver's friendRequests array.
        const receiverDocRef = doc(db, "users", receiver.id);
        const receiverSnapshot = await getDoc(receiverDocRef);
        const receiverData = receiverSnapshot.data();
        const receiverFriendRequests = receiverData.friendRequests || [];
        const updatedFriendRequests = receiverFriendRequests.filter(request => request.id !== currentUser.uid);
        await setDoc(receiverDocRef, { ...receiverData, friendRequests: updatedFriendRequests });
    }
  }
);

export const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    friends: [],
    userIncomingFriendRequests: [],
    userOutgoingFriendRequests: [],
  },
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setUserFriendRequests: (state, action) => {
      state.userIncomingFriendRequests = action.payload;
    },
    setUserOutgoingRequests: (state, action) => {
      state.userOutgoingFriendRequests = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.friends = action.payload.friends;
        state.userIncomingFriendRequests = action.payload.incomingFriendRequests;
        state.userOutgoingFriendRequests = action.payload.outgoingFriendRequests;
      });
  },
});

export const { setFriends, setUserFriendRequests, setUserOutgoingRequests } = friendsSlice.actions;
export default friendsSlice.reducer;