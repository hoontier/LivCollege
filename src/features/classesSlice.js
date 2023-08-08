//classesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { fetchAllClasses, fetchUserDetails } from './dataSlice';


//add class to user's classes array
export const addClass = createAsyncThunk(
  'classes/addClass',
  async ({ user, classData }) => {
    const userDocRef = doc(db, 'users', user.id);

    // Fetch user document
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      // Get classes array
      const classes = userDoc.data().classes;

      // Add the new class to the array
      const updatedClasses = arrayUnion(classData);

      // Update user document with the updated classes array
      await updateDoc(userDocRef, {
        classes: updatedClasses,
      });
    }
  }
);


//remove class from user's classes array
export const removeClass = createAsyncThunk(
  'classes/removeClass',
  async ({ user, classId }) => {
    const userDocRef = doc(db, 'users', user.id);

    // Fetch user document
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      // Get classes array
      const classes = userDoc.data().classes;

      // Filter out the class to be removed
      const updatedClasses = classes.filter((classItem) => classItem.id !== classId);

      // Update user document with the updated classes array
      await updateDoc(userDocRef, {
        classes: updatedClasses,
      });
    }
  }
);



export const classesSlice = createSlice({
  name: 'classes',
  initialState: {
    allClasses: [],
    userClasses: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userClasses = action.payload.classes;
      })
      .addCase(fetchAllClasses.fulfilled, (state, action) => {
        state.allClasses = action.payload;
      })
      .addCase(removeClass.fulfilled, (state, action) => {
        state.userClasses = state.userClasses.filter((classObj) => classObj.id !== action.meta.arg.classId);
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.userClasses = [...state.userClasses, action.meta.arg.classData];
      });      
  },
});

export default classesSlice.reducer;
