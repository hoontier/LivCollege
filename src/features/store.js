// store.js
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import classesReducer from './classesSlice';
import friendsReducer from './friendsSlice';
import filtersReducer from './filtersSlice';
import eventReducer from './eventsSlice';

const store = configureStore({
  reducer: {
    data: dataReducer,
    event: eventReducer,
    classes: classesReducer,
    friends: friendsReducer,
    filters: filtersReducer,
  },
});

export default store;
