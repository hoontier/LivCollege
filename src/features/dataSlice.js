//dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { acceptInviteThunk } from './groupsSlice';
import { addEventToFirestore, removeEventFromFirestore, updateEventInFirestore } from './eventsSlice';

export const fetchAllUsers = createAsyncThunk(
  'data/fetchAllUsers',
  async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map((userDoc) => ({
      id: userDoc.id,
      ...userDoc.data(),
    })).map(user => ({
      id: user.id,
      ...user
    }));
  }
);

export const fetchAllClasses = createAsyncThunk(
  'data/fetchAllClasses',
  async () => {
    const classesRef = collection(db, 'classes');
    const classQuery = query(classesRef, orderBy('course'), orderBy('section'));
    const classSnapshot = await getDocs(classQuery);
    return classSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })).map(classData => ({
      id: classData.id,
      ...classData
    }));
  }
);

export const fetchUserDetails = createAsyncThunk(
  'data/fetchUserDetails',
  async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);
    const userData = userSnapshot.data();
    return {
      id: userSnapshot.id,
      classes: userData.classes || [],
      friends: userData.friends || [],
      incomingFriendRequests: userData.friendRequests || [],
      outgoingFriendRequests: userData.outgoingRequests || [],
      name: userData.name || '',
      lastName: userData.lastName || '',
      username: userData.username || '',
      bio: userData.bio || '',
      photoURL: userData.photoURL || '',
      recurringEvents: userData.recurringEvents || [],
      occasionalEvents: userData.occasionalEvents || [],
      groups: userData.groups || [],
      groupInvites: userData.groupInvites || [],
      groupRequests: userData.groupRequests || [],
    };
  }
);


export const dataSlice = createSlice({
    name: 'data',
    initialState: {
      users: [],
      user: null,  // add user to the initial state
      isLoading: false,
      isEditingUser: false,
    },    
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllUsers.pending, (state, action) => {
          state.isLoading = true;
        })
        .addCase(fetchAllUsers.fulfilled, (state, action) => {
          state.users = action.payload;
          state.isLoading = false;
        })
        .addCase(fetchUserDetails.pending, (state, action) => {
          state.isLoading = true;
        })
        .addCase(acceptInviteThunk.fulfilled, (state, action) => {
          if (state.user && state.user.groups) {
              state.user.groups.push(action.payload.groupId);
          }
        })
        .addCase(fetchUserDetails.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;  // Update the user when fetchUserDetails is fulfilled
        })
        .addCase(addEventToFirestore.fulfilled, (state, action) => {
          if (state.user) {
            if (action.meta.arg.type === 'recurring') {
              state.user.recurringEvents.push(action.payload);
            } else {
              state.user.occasionalEvents.push(action.payload);
            }
          }
        })
        .addCase(removeEventFromFirestore.fulfilled, (state, action) => {
          if (state.user) {
            if (action.meta.arg.type === 'recurring') {
              state.user.recurringEvents = state.user.recurringEvents.filter(event => event.id !== action.meta.arg.eventId);
            } else {
              state.user.occasionalEvents = state.user.occasionalEvents.filter(event => event.id !== action.meta.arg.eventId);
            }
          }
        })
        .addCase(updateEventInFirestore.fulfilled, (state, action) => {
          if (state.user) {
            const eventToUpdate = action.payload;
            if (action.meta.arg.event.type === 'recurring') {
              const index = state.user.recurringEvents.findIndex(event => event.id === eventToUpdate.id);
              if (index !== -1) {
                state.user.recurringEvents[index] = eventToUpdate;
              }
            } else {
              const index = state.user.occasionalEvents.findIndex(event => event.id === eventToUpdate.id);
              if (index !== -1) {
                state.user.occasionalEvents[index] = eventToUpdate;
              }
            }
          }
        });
    },
});
  
export default dataSlice.reducer;