import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import movieCacheReducer from "./movieSlice";
import movieDetailReducer from './movieDetailSlice'; 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    movieCache: movieCacheReducer,
    movieDetail: movieDetailReducer,
  },
});

export default store;