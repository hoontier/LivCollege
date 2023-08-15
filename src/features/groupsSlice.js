// groupsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, doc, setDoc, updateDoc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { fetchUserDetails } from './dataSlice';

// Async Thunk for creating a new group
export const createGroupInFirestore = createAsyncThunk(
    'groups/createGroup',
    async (payload, { dispatch }) => {
        const groupDocRef = await addDoc(collection(db, 'groups'), {
            title: payload.title,
            description: payload.description,
            members: [payload.userId],
            recurringEvents: [],
            occasionalEvents: []
        });
        
        const userDocRef = doc(db, 'users', payload.userId);
        const userGroups = (await getDoc(userDocRef)).data().groups || [];
        userGroups.push(groupDocRef.id);
        await updateDoc(userDocRef, { groups: userGroups });

        // Dispatch fetchUserDetails to refresh user data in Redux store
        dispatch(fetchUserDetails({ uid: payload.userId }));
        return groupDocRef.id;
    }
);

// Alter this thunk so that the events are added to the user's recurringEvents or occasionalEvents array, and that the events are added to the group's groupRecurringEvents or groupOccasionalEvents array
export const addGroupEventToFirestore = createAsyncThunk(
    'events/addGroupEvent',
    async (payload, { dispatch }) => {
      const userDocRef = doc(db, 'users', payload.userId);
      let updatedEvents;
      if (payload.type === "groupRecurring") {
        updatedEvents = (await getDoc(userDocRef)).data().recurringEvents || [];
        updatedEvents.push(payload.event);
        await updateDoc(userDocRef, { recurringEvents: updatedEvents });
      } else {
        updatedEvents = (await getDoc(userDocRef)).data().occasionalEvents || [];
        updatedEvents.push(payload.event);
        await updateDoc(userDocRef, { occasionalEvents: updatedEvents });
      }
      
      // Now let's update the group's events
      const groupDocRef = doc(db, 'groups', payload.groupId);
      let groupEvents;
      if (payload.type === "groupRecurring") {
        groupEvents = (await getDoc(groupDocRef)).data().groupRecurringEvents || [];
        groupEvents.push(payload.event);
        await updateDoc(groupDocRef, { groupRecurringEvents: groupEvents });
      } else {
        groupEvents = (await getDoc(groupDocRef)).data().groupOccasionalEvents || [];
        groupEvents.push(payload.event);
        await updateDoc(groupDocRef, { groupOccasionalEvents: groupEvents });
      }
  
      // Dispatch fetchUserDetails after the Firestore update to refresh user data in the Redux store
      dispatch(fetchUserDetails({ uid: payload.userId }));
  
      return payload.event;
    }
  );
  

  
const groupsSlice = createSlice({
    name: 'groups',
    initialState: {
        isLoading: false,
        currentGroup: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createGroupInFirestore.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(createGroupInFirestore.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentGroup = action.payload;
            });
        // Handle other action types accordingly...
    },
});

export default groupsSlice.reducer;
