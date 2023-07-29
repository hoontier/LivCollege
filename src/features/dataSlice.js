//dataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

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
        });
        builder
        .addCase(fetchUserDetails.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;  // Update the user when fetchUserDetails is fulfilled
        });
    },
});
  
export default dataSlice.reducer;