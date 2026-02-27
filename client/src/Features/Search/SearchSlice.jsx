import { createSlice } from '@reduxjs/toolkit';

const currentDate = new Date();
const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // "YYYY-MM-DD" format

const newDate = new Date(currentDate);
newDate.setDate(currentDate.getDate() + 1); // Get tomorrow's date
const formattedTomorrow = newDate.toISOString().split('T')[0];

const initialState = {
  search: '',
  startDate: formattedCurrentDate,
  endDate: formattedTomorrow,
  guestCount: 1,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState, // Corrected here
  reducers: {
    setSearchDetails: (state, action) => {
      state.search = action.payload.search;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.guestCount = action.payload.guestCount;
    },
  },
});

export const { setSearchDetails } = searchSlice.actions;

export default searchSlice.reducer;
