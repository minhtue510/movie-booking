import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import movieCacheReducer from "./movieSlice";
import movieDetailReducer from './movieDetailSlice';
import bookingReducer from './bookingSlice';
import ticketsReducer from './ticketsSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    movieCache: movieCacheReducer,
    movieDetail: movieDetailReducer,
    booking: bookingReducer,
    tickets: ticketsReducer
  },
});

export default store;