import movies from "../data/movies.json";

export const getMovies = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(movies), 500); // Giả lập delay để giống gọi API
  });
};
