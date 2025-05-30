import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movieImage: "",
  selectedSeats: [],
  selectedTime: null,
  selectedDate: null,
  totalPrice: 0,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setMovieImage: (state, action) => {
      state.movieImage = action.payload;
    },
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
  },
});

export const {
  setMovieImage,
  setSelectedSeats,
  setSelectedTime,
  setSelectedDate,
  setTotalPrice,
} = bookingSlice.actions;

export default bookingSlice.reducer;
