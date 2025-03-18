import React from "react";
import SearchBar from "../components/SearchBar";
import MovieSection from "../components/MovieSection";
import BottomNav from "../components/BottomNav";

const Home = () => {
  return (
    <div className="bg-black min-h-screen text-white px-4 pb-16">
      <div className="pt-6">
        <SearchBar />
      </div>

      <MovieSection
        title="Now Playing"
        movies={[
          { title: "John Wick: Chapter 4", image: "/image 5.png", rating: "8.0", genres: ["Action", "Thriller", "Crime"] },
          { title: "Shazam", image: "/image 7.png", rating: "8.5", genres: ["Sci-Fi", "Adventure"] },
          { title: "Avenger: Age of Ultron", image: "/image 19.png", rating: "7.9", genres: ["Action", "Crime", "Drama"] },
          { title: "Avenger Infinity War", image: "/image 16.png", rating: "7.9", genres: ["Action", "Crime", "Drama"] },
          { title: "Avenger End Game", image: "/image 18.png", rating: "7.9", genres: ["Action", "Crime", "Drama"] }
        ]}
      />

      <MovieSection
        title="Popular"
        movies={[
          { title: "Shazam", image: "/image 7.png" },
          { title: "John Wick: Chapter 4", image: "/image 5.png" },
          { title: "Avenger: Age of Ultron", image: "/image 19.png" },
          { title: "Avenger Infinity War", image: "/image 16.png" },
          { title: "Avenger End Game", image: "/image 18.png" },
        ]}
      />

      <MovieSection
        title="Upcoming"
        movies={[
          { title: "Shazam", image: "/image 7.png" },
          { title: "John Wick: Chapter 4", image: "/image 5.png" },
          { title: "Avenger: Age of Ultron", image: "/image 19.png" },
          { title: "Avenger Infinity War", image: "/image 16.png" },
          { title: "Avenger End Game", image: "/image 18.png" },
        ]}
      />

      <BottomNav />
    </div>
  );
};

export default Home;
