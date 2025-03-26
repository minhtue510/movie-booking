import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import MovieSection from "../../components/MovieSection";
import BottomNav from "../../components/BottomNav";

const Home = () => {
  const [movies, setMovies] = useState({ nowPlaying: [], upcoming: [], popular: [] });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://minhtue-001-site1.ktempurl.com/api/movies");
        const result = await response.json();

        if (!result || !Array.isArray(result.data)) {
          throw new Error("Dữ liệu từ API không hợp lệ");
        }

        const formattedMovies = result.data.map(movie => ({
          id: movie.movieId,
          title: movie.title,
          rating: movie.rating || 0,
          genres: movie.genres.length ? movie.genres : [],
          image: movie.imageMovie.length ? movie.imageMovie[0] : "https://via.placeholder.com/200x300?text=No+Image",
          status: movie.status.toLowerCase() 
        }));

        const nowPlaying = formattedMovies.filter(movie => movie.status === "playing");
        const upcoming = formattedMovies.filter(movie => movie.status === "upcoming");
        const popular = nowPlaying.filter(movie => movie.rating >= 7.5); 

        setMovies({ nowPlaying, upcoming, popular });
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white px-8 pb-16">
      <div className="pt-6">
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
