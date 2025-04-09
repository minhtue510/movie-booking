import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../services/getMovies";
import unorm from "unorm";

const SearchBar = ({ query, onSearchChange,  onKeyDown, showDropdown = true }) => {

  const [input, setInput] = useState(query || "");
  useEffect(() => {
    setInput(query || "");
  }, [query]);
  const [debouncedInput, setDebouncedInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allMovies, setAllMovies] = useState([]); 
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  useEffect(() => {
    const fetch = async () => {
      const movies = await getMovies();
      setAllMovies(movies);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!debouncedInput?.trim()) {
      setSuggestions([]);
      return;
    }



    const normalizedQuery = unorm.nfd(debouncedInput).replace(/[\u0300-\u036f]/g, "");

    const filtered = allMovies.filter((movie) => {
      const normalizedTitle = unorm.nfd(movie.title).replace(/[\u0300-\u036f]/g, "");
      return normalizedTitle.toLowerCase().includes(normalizedQuery.toLowerCase());
    });

    setSuggestions(filtered.slice(0, 5));
  }, [debouncedInput, allMovies]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  

  const handleSelect = (movieId) => {
    navigate(`/movies/${movieId}`);
    setInput("");
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/search?query=${input}`);
      setSuggestions([]);
    } else {
      navigate(`/search?query=`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search your Movies..."
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-11 w-full bg-black text-white border border-gray-600 rounded-full px-5 pr-12 text-sm placeholder-gray-400 outline-none transition"
      />
      <SearchOutlined
        style={{ color: "#FF5524" }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer"
        onClick={handleSearch}
      />

      {showDropdown && !isMobile && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-[#1f1f1f] border border-gray-700 rounded-md mt-1 z-50 shadow-lg max-h-60 overflow-auto">
          {suggestions.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center px-4 py-2 hover:bg-[#2c2c2c] cursor-pointer text-sm text-white"
              onClick={() => handleSelect(movie.id)}
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-12 h-18 object-cover rounded-md mr-4" 
              />
              <span>{movie.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
