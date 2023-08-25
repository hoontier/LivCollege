//classesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove, addDoc, collection, deleteDoc } from 'firebase/firestore';
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

// Inside classesSlice.js

export const createClass = createAsyncThunk(
  'classes/createClass',
  async ({ user, classData }, thunkAPI) => {
    // 1. Add the class to Firestore's classes collection
    const classRef = await addDoc(collection(db, 'classes'), classData);
    // Add the Firestore ID to our new class data
    classData.id = classRef.id;
    
    // 2. Update user's Firestore document with the new class data that includes the Firestore ID
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
        classes: arrayUnion(classData)
    });

    // 3. Dispatch the addClass action to update the Redux store
    thunkAPI.dispatch(addClass({ user: user, classData: classData }));
    
    return classData; // You can return any data here, or modify as needed for your use case
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

// Update user class after edit
export const updateUserClass = createAsyncThunk(
  'classes/updateUserClass',
  async (updatedClassData) => {
    return updatedClassData;
  }
);

// delete class and add it to deletedClasses collection
// export const deleteAndBackupClass = createAsyncThunk(
//   'classes/deleteAndBackupClass',
//   async ({ classId, classData }) => {
//     // Deleting the class from classes collection
//     const classDocRef = doc(db, 'classes', classId);
//     await deleteDoc(classDocRef);

//     // Adding the class to deletedClasses collection
//     await addDoc(collection(db, 'deletedClasses'), classData);
//   }
// );


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
      .addCase(updateUserClass.fulfilled, (state, action) => {
        // Find the index of the class that was edited
        const index = state.userClasses.findIndex(classObj => classObj.id === action.payload.id);
        if (index !== -1) {
          state.userClasses[index] = action.payload;
        }
      })
      // .addCase(deleteAndBackupClass.fulfilled, (state, action) => {
      //   state.allClasses = state.allClasses.filter((classObj) => classObj.id !== action.meta.arg.classId);
      // })  
      .addCase(createClass.fulfilled, (state, action) => {
        state.allClasses = [...state.allClasses, action.payload];
      })
      .addCase(addClass.fulfilled, (state, action) => {
        state.userClasses = [...state.userClasses, action.meta.arg.classData];
      });      
  },
});

export default classesSlice.reducer;
