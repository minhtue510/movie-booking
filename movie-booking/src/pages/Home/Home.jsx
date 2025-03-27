import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import MovieSection from "../../components/MovieSection";
import BottomNav from "../../components/BottomNav";

const Home = () => {
  const [movies, setMovies] = useState({ nowPlaying: [], upcoming: [], popular: [] });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let allMovies = [];
        let page = 1;
        let totalPages = 1;

        do {
          const response = await fetch(`http://minhtue-001-site1.ktempurl.com/api/movies?page=${page}&pageSize=10`);
          const result = await response.json();

          if (!result || !Array.isArray(result.data)) {
            throw new Error("Dữ liệu từ API không hợp lệ");
          }

          allMovies = [...allMovies, ...result.data.map(movie => ({
            id: movie.movieId,
            title: movie.title,
            rating: movie.rating || 0,
            genres: movie.genres.length ? movie.genres : [],
            image: movie.imageMovie.length ? movie.imageMovie[0] : "https://via.placeholder.com/200x300?text=No+Image",
            status: movie.status.toLowerCase(),
          }))];

          totalPages = result.totalPages;
          page++;
        } while (page <= totalPages);

        const nowPlaying = allMovies.filter(movie => movie.status === "playing");
        const upcoming = allMovies.filter(movie => movie.status === "upcoming");
        const popular = allMovies.filter(movie => movie.rating >= 7.0);

        setMovies({ nowPlaying, upcoming, popular });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white px-8 pb-16">
      <div className="p-4">
        <SearchBar />
      </div>
      <MovieSection title="Now Playing" movies={movies.nowPlaying} />
      {movies.popular.length > 0 && <MovieSection title="Popular" movies={movies.popular} />}
      <MovieSection title="Upcoming" movies={movies.upcoming} />
      <BottomNav />
    </div>
  );
};

export default Home;
