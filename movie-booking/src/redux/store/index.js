import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import movieCacheReducer from "./movieSlice";
import movieDetailReducer from './movieDetailSlice';
import bookingReducer from './bookingSlice';
import ticketsReducer from './ticketsSlice';
import historyReducer from "./historySlice";
import ticketDetailReducer from "./ticketDetailSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    movieCache: movieCacheReducer,
    movieDetail: movieDetailReducer,
    booking: bookingReducer,
    tickets: ticketsReducer,
    history: historyReducer,
    ticketDetail: ticketDetailReducer,
  },
});

export default store;