import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './Features/Counter/CounterSlice';
import searchReducer from './Features/Search/SearchSlice';
import bookingReducer from './Features/Booking/BookingSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    searchDetailes: searchReducer,
    booking: bookingReducer,
  },
});
