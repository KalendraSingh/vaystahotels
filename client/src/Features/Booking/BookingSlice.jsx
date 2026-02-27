// src/redux/slices/bookingSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookingDetails: {
    customerId: null,
    hotelId: null,
    startDate: null,
    endDate: null,
    nights: 0,
    totalAmount: 0,
    totalDiscount: 0,
    amountWithGst: 0,
    payAmount: 0,
    roomSelections: [],
  },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Action to set booking details dynamically
    setBookingDetails: (state, action) => {
      state.bookingDetails = action.payload;
    },
    // Action to update room selections
    updateRoomSelections: (state, action) => {
      state.bookingDetails.roomSelections = action.payload;
    },
    // Action to reset booking details
    resetBookingDetails: (state) => {
      state.bookingDetails = initialState.bookingDetails;
    },
  },
});

// const fetchBookingDetails

// Export actions
export const { setBookingDetails, updateRoomSelections, resetBookingDetails } =
  bookingSlice.actions;

// Export reducer
export default bookingSlice.reducer;
