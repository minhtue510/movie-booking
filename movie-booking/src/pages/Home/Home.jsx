import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import MovieSection from "../../components/MovieSection/MovieSection";
import BottomNav from "../../components/BottomNav/BottomNav";
import { getMovies } from "../../services/getMovies";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserFromToken } from "../../redux/store/authSlice";
import Header from "../../components/Header/Header";
import { setMovies } from "../../redux/store/movieSlice";
const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { nowPlaying, upcoming, popular, loaded } = useSelector((state) => state.movieCache);

  useEffect(() => {
    const fetchAndSetMovies = async () => {
      const allMovies = await getMovies();
      const nowPlaying = [], upcoming = [], popular = [];

      allMovies.forEach((movie) => {
        if (movie.status === "playing") nowPlaying.push(movie);
        if (movie.status === "upcoming") upcoming.push(movie);
        if (movie.rating >= 7.0) popular.push(movie);
      });

      dispatch(setMovies({ nowPlaying, upcoming, popular }));
    };

    if (!loaded) {
      fetchAndSetMovies();
    }
  }, [dispatch, loaded]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchUserFromToken());
    }
  }, [dispatch, user]);

  return (
    <div className="bg-black min-h-screen text-white pb-16">
      <Header />

      <div className="p-5 md:hidden">
        <SearchBar />
      </div>

      <div className="px-5">
        <>
          <MovieSection titleKey="nowPlaying" movies={nowPlaying} />
          <MovieSection titleKey="popular" movies={popular} />
          <MovieSection titleKey="upcoming" movies={upcoming} />

        </>
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
