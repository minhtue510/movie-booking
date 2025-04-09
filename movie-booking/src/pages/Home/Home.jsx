import React, { useEffect, useState } from "react";
import { Skeleton } from "antd";
import SearchBar from "../../components/SearchBar";
import MovieSection from "../../components/MovieSection";
import BottomNav from "../../components/BottomNav";
import { getMovies } from "../../services/getMovies";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserFromToken } from "../../redux/store/authSlice";
import Header from "../../components/Header";

const Home = () => {
  const [movies, setMovies] = useState({ nowPlaying: [], upcoming: [], popular: [] });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const fetchAndSetMovies = async () => {
    setLoading(true);
    const allMovies = await getMovies();

    const nowPlaying = [], upcoming = [], popular = [];

    allMovies.forEach((movie) => {
      if (movie.status === "playing") nowPlaying.push(movie);
      if (movie.status === "upcoming") upcoming.push(movie);
      if (movie.rating >= 7.0) popular.push(movie);
    });

    setMovies({ nowPlaying, upcoming, popular });
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetMovies();
  }, []);

  useEffect(() => {
    dispatch(fetchUserFromToken());
  }, [dispatch]);

  return (
    <div className="bg-black min-h-screen text-white pb-16">
      <Header />

      <div className="p-5 md:hidden">
        <SearchBar />
      </div>

      <div className="px-5">
        {loading ? (
          <>
      
          </>
        ) : (
          <>
            <MovieSection title="Now Playing" movies={movies.nowPlaying} />
            {movies.popular.length > 0 && (
              <MovieSection title="Popular" movies={movies.popular} />
            )}
            <MovieSection title="Upcoming" movies={movies.upcoming} />
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
