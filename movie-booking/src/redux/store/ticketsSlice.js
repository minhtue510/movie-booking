import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo state ban đầu cho vé
const initialState = {
  list: [], // Danh sách vé
  loading: false, // Trạng thái tải dữ liệu
  error: null, // Trạng thái lỗi
};

// Tạo slice cho tickets
const ticketsSlice = createSlice({
  name: 'tickets', // Tên slice
  initialState,
  reducers: {
    // Action để cập nhật danh sách vé
    setTickets: (state, action) => {
      state.list = action.payload;
    },
    // Action để cập nhật trạng thái loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Action để cập nhật lỗi nếu có
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export các actions từ slice
export const { setTickets, setLoading, setError } = ticketsSlice.actions;

// Export reducer để đưa vào store
export default ticketsSlice.reducer;
