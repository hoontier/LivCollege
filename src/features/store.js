// store.js
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import classesReducer from './classesSlice';
import friendsReducer from './friendsSlice';
import filtersReducer from './filtersSlice';

const store = configureStore({
  reducer: {
    data: dataReducer,
    classes: classesReducer,
    friends: friendsReducer,
    filters: filtersReducer,
  },
});

export default store;
