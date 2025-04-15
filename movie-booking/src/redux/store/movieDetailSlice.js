import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMovie: null,
  topCast: {}, // Lưu thông tin diễn viên theo movieId
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
      // Chỉ cập nhật topCast cho movieId nếu chưa có
      if (!state.topCast[movieId]) {
        state.topCast[movieId] = cast;
      }
    },
  },
});

export const { setSelectedMovie, setTopCast } = movieDetailSlice.actions;
export default movieDetailSlice.reducer;
