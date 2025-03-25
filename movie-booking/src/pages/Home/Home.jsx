import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import MovieSection from "../../components/MovieSection";
import BottomNav from "../../components/BottomNav";
import moviesData from "../../data/movies.json";

const Home = () => {
  const [movies, setMovies] = useState({ nowPlaying: [], upcoming: [], popular: [] });

  useEffect(() => {
    const nowPlaying = moviesData.movies.filter(movie => movie.status === "nowPlaying");
    const upcoming = moviesData.movies.filter(movie => movie.status === "upcoming");
    const popular = nowPlaying.filter(movie => movie.rating >= 7.5);
    setMovies({ nowPlaying, upcoming, popular });
  }, []);

  return (
    <div className="bg-black min-h-screen text-white px-4 pb-16">
      <div className="pt-6">
        <SearchBar />
      </div>
      <MovieSection title="Now Playing" movies={movies.nowPlaying} />
      <MovieSection title="Popular" movies={movies.popular} />
      <MovieSection title="Upcoming" movies={movies.upcoming} />
      <BottomNav />
    </div>
  );
};

export default Home;

