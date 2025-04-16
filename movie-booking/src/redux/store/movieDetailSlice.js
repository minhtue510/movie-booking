import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMovie: null,
  topCast: {}, 
};

const movieDetailSlice = createSlice({
  name: "movieDetail",
  initialState,
  reducers: {
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
    },
    setTopCast: (state, action) => {
      const { movieId, cast } = action.payload;
      if (!state.topCast[movieId]) {
        state.topCast[movieId] = cast;
      }
    },
  },
});

export const { setSelectedMovie, setTopCast } = movieDetailSlice.actions;
export default movieDetailSlice.reducer;
