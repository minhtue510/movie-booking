import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import moviesData from "../data/movies.json";

const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filteredMovies = (moviesData.movies || []).filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  );
  

  return (
    <div className="bg-black min-h-screen text-white px-8 pb-16">
      <div className="pt-6">
        <SearchBar query={query} setQuery={setQuery} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="cursor-pointer"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={movie.image}
              alt={movie.title}
              className="w-[166px] h-[250px] object-cover rounded-lg shadow-md"
            />
            <p className="text-sm text-center mt-2">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
