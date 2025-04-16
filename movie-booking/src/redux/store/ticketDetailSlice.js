import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTicketDetail } from "../../services/getTicketDetail";
import { jwtDecode } from "jwt-decode";

export const fetchTicketDetail = createAsyncThunk(
  "ticketDetail/fetchTicketDetail",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return rejectWithValue("Không tìm thấy token");

      const decodedToken = jwtDecode(token);
      const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      const data = await getTicketDetail(userId, id);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ticketDetailSlice = createSlice({
  name: "ticketDetail",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketDetail.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.loading = false;
      })
      .addCase(fetchTicketDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ticketDetailSlice.reducer;
