import React, { useEffect, useState } from "react";
import { Skeleton } from "antd"; // Import Skeleton từ Ant Design
import SearchBar from "../../components/SearchBar";
import MovieSection from "../../components/MovieSection";
import BottomNav from "../../components/BottomNav";
import { getMovies } from "../../services/getMovies";

const Home = () => {
  const [movies, setMovies] = useState({ nowPlaying: [], upcoming: [], popular: [] });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const allMovies = await getMovies();
      const nowPlaying = allMovies.filter(movie => movie.status === "playing");
      const upcoming = allMovies.filter(movie => movie.status === "upcoming");
      const popular = allMovies.filter(movie => movie.rating >= 7.0);

      setMovies({ nowPlaying, upcoming, popular });
      setLoading(false);
    };

    fetchMovies();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white px-8 pb-16">
      <div className="p-4">
        <SearchBar />
      </div>

      {loading ? (
        <Skeleton active className="my-4" paragraph={{ rows: 4 }} /> 
      ) : (
        <>
          <MovieSection title="Now Playing" movies={movies.nowPlaying} />
          {movies.popular.length > 0 && <MovieSection title="Popular" movies={movies.popular} />}
          <MovieSection title="Upcoming" movies={movies.upcoming} />
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default Home;
