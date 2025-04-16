import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getHistory } from "../../services/getHistory";
import { jwtDecode } from "jwt-decode";

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("No token");

      const decoded = jwtDecode(token);
      const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const { data } = await getHistory(userId);
      return data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.tickets  = action.payload;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;
