import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nowPlaying: [],
  upcoming: [],
  popular: [],
  loaded: false,
};

const movieCacheSlice = createSlice({
  name: 'movieCache',
  initialState,
  reducers: {
    setMovies: (state, action) => {
      const { nowPlaying, upcoming, popular } = action.payload;
      state.nowPlaying = nowPlaying;
      state.upcoming = upcoming;
      state.popular = popular;
      state.loaded = true;
    },
  },
});



export const { setMovies } = movieCacheSlice.actions;
export default movieCacheSlice.reducer;
