import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  title: '',
  background: '',
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      const { id, title, background } = action.payload;
      state.id = id;
      state.title = title;
      state.background = background;
    },
    clearSelectedMovie: (state) => {
      state.id = null;
      state.title = '';
      state.background = '';
    }
  },
});

export const { setSelectedMovie, clearSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;
