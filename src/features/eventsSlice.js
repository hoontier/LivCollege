//eventsSlcice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Async Thunk for adding events
export const addEventToFirestore = createAsyncThunk(
  'events/addEvent',
  async (payload) => {
    const userDocRef = doc(db, 'users', payload.userId);
    if (payload.type === "recurring") {
      const updatedRecurringEvents = (await getDoc(userDocRef)).data().recurringEvents || [];
      updatedRecurringEvents.push(payload.event);
      await updateDoc(userDocRef, { recurringEvents: updatedRecurringEvents });
    } else {
      const updatedOccasionalEvents = (await getDoc(userDocRef)).data().occasionalEvents || [];
      updatedOccasionalEvents.push(payload.event);
      await updateDoc(userDocRef, { occasionalEvents: updatedOccasionalEvents });
    }
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

export default eventSlice.reducer;
