//eventsSlcice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { fetchUserDetails } from './dataSlice';

// Async Thunk for adding events
export const addEventToFirestore = createAsyncThunk(
    'events/addEvent',
    async (payload, { dispatch }) => {  // added { dispatch } to use dispatch within the thunk
      const userDocRef = doc(db, 'users', payload.userId);
      let updatedEvents;
      if (payload.type === "recurring") {
        updatedEvents = (await getDoc(userDocRef)).data().recurringEvents || [];
        updatedEvents.push(payload.event);
        await updateDoc(userDocRef, { recurringEvents: updatedEvents });
      } else {
        updatedEvents = (await getDoc(userDocRef)).data().occasionalEvents || [];
        updatedEvents.push(payload.event);
        await updateDoc(userDocRef, { occasionalEvents: updatedEvents });
      }
      
      // Dispatch fetchUserDetails after the Firestore update to refresh user data in the Redux store
      dispatch(fetchUserDetails({ uid: payload.userId }));
  
      return payload.event;
    }
  );

  export const removeEventFromFirestore = createAsyncThunk(
    'events/removeEvent',
    async (payload, { dispatch }) => {
      const userDocRef = doc(db, 'users', payload.user.id);
      let currentEvents;
      if (payload.type === "recurring") {
        currentEvents = (await getDoc(userDocRef)).data().recurringEvents || [];
      } else {
        currentEvents = (await getDoc(userDocRef)).data().occasionalEvents || [];
      }
      const updatedEvents = currentEvents.filter(event => event.id !== payload.eventId);
      await updateDoc(userDocRef, { [payload.type + 'Events']: updatedEvents });
  
      dispatch(fetchUserDetails({ uid: payload.user.id }));
    }
  );

  // Inside eventsSlice.js

// Async Thunk for updating events
export const updateEventInFirestore = createAsyncThunk(
    'events/updateEvent',
    async (payload, { dispatch }) => {
      const userDocRef = doc(db, 'users', payload.userId);
      
      let eventArray;
      if (payload.event.type === "recurring") {
        eventArray = (await getDoc(userDocRef)).data().recurringEvents || [];
      } else {
        eventArray = (await getDoc(userDocRef)).data().occasionalEvents || [];
      }
  
      // Finding the event index by matching the title and start time. (Consider using unique event IDs in the future)
      const eventIndex = eventArray.findIndex(event => event.title === payload.event.title && event.startTime === payload.event.startTime);
      
      if (eventIndex !== -1) {
        // Update the event
        eventArray[eventIndex] = payload.event;
  
        if (payload.event.type === "recurring") {
          await updateDoc(userDocRef, { recurringEvents: eventArray });
        } else {
          await updateDoc(userDocRef, { occasionalEvents: eventArray });
        }
      }
      
      // Dispatch fetchUserDetails after the Firestore update to refresh user data in the Redux store
      dispatch(fetchUserDetails({ uid: payload.userId }));
      return payload.event;
    }
  );
  

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    isAddingEvent: false,
  },
  reducers: {
    setDateSelectionType: (state, action) => {
      state.dateSelectionType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addEventToFirestore.pending, (state, action) => {
        state.isAddingEvent = true;
      })
      .addCase(addEventToFirestore.fulfilled, (state, action) => {
        state.isAddingEvent = false;
      });
  },
});

export const { setDateSelectionType } = eventSlice.actions;
export const removeEvent = removeEventFromFirestore;

export default eventSlice.reducer;
