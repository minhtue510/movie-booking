// src/redux/store/moviesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMovies } from '../../services/getMovies';

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await getMovies();
  return response;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    all: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default searchSlice.reducer;
