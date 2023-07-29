import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    searchTerm: '',
    isHonors: false,
    selectedDays: [],
    currentPage: 1,
    classesPerPage: 10,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setIsHonors: (state, action) => {
      state.isHonors = action.payload;
    },
    setSelectedDays: (state, action) => {
      state.selectedDays = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setClassesPerPage: (state, action) => {
      state.classesPerPage = action.payload;
    },
  },
});

export const { setSearchTerm, setIsHonors, setSelectedDays, setCurrentPage, setClassesPerPage } = filtersSlice.actions;

export default filtersSlice.reducer;
