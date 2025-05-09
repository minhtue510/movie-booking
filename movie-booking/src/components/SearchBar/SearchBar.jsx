import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../../services/getMovies";
import { useTranslation } from "react-i18next";
import searchIcon from "../../assets/icon/search.png";
const SearchBar = ({ query, onSearchChange, showDropdown = true }) => {
  const [input, setInput] = useState(query || "");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 639);
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

  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
  
    try {
      const movies = await getMovies(searchTerm);
  
      if (movies.length === 0) {
        setSuggestions([]); 
      } else {
        setSuggestions(movies);
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    }
  };
  

  useEffect(() => {
    if (debouncedInput) {
      fetchSuggestions(debouncedInput); 
    }
  }, [debouncedInput]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  const handleSearch = () => {
    if (input.trim()) {
      navigate(`/Search?query=${input}`);
      setSuggestions([]);
    } else {
      navigate(`/Search?query=`);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={input}
        onChange={handleChange}
        onClick={() => {
            navigate("/search");
        }}
        className="h-13 w-full bg-black text-14 font-regular text-gray border-2 border-gray rounded-[15px] px-5 pr-12 placeholder-gray-400 outline-none transition"
      />
      <img
      src={searchIcon}
        style={{ color: "#FF5524" }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer "
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
