import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [], 
  loading: false,
  error: null, 
};

const ticketsSlice = createSlice({
  name: 'tickets', 
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});
export const { setTickets, setLoading, setError } = ticketsSlice.actions;
export default ticketsSlice.reducer;
