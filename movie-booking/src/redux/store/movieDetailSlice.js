
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMovie: null,
};

const movieDetailSlice = createSlice({
  name: "movieDetail",
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
});

export const { setSelectedMovie, clearSelectedMovie } = movieDetailSlice.actions;
export default movieDetailSlice.reducer;
