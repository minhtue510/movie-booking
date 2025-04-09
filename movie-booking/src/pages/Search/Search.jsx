import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import BottomNav from "../../components/BottomNav";
import { getMovies } from "../../services/getMovies";
import { Pagination, Skeleton } from "antd";
import unorm from "unorm";
import { CloseCircleOutlined } from "@ant-design/icons";
import "../Search/Search.css";


const Search = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("query") || "";
    setQuery(queryParam);
  }, [location]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await getMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query === "") {
        setFilteredMovies(movies);
      } else {
        const queryLower = query.toLowerCase();
        const queryNoAccent = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
        const exactFullMatch = [];
        const matchedExactly = [];
        const matchedWithoutAccent = [];
  
        movies.forEach((movie) => {
          const titleLower = movie.title.toLowerCase();
          const titleNoAccent = movie.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

          if (titleLower === queryLower) {
            exactFullMatch.push(movie);
          }
    
          else if (titleLower.includes(queryLower)) {
            matchedExactly.push(movie);
          }
          else if (titleNoAccent.includes(queryNoAccent)) {
            matchedWithoutAccent.push(movie);
          }
        });
  
        setFilteredMovies([...exactFullMatch, ...matchedExactly, ...matchedWithoutAccent]);
        setCurrentPage(1);
      }
    }, 300);
  
    return () => clearTimeout(handler);
  }, [query, movies]);
  
  const handleSearchChange = (value) => {
    setQuery(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-black min-h-screen text-white px-4 sm:px-6 md:px-10 pb-20">
      <div className="pt-6 flex justify-center items-center relative">
        <button
          onClick={() => navigate("/home")}
          className="absolute left-0 w-10 h-10 bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#e44b1e] transition hidden md:flex"
        >
          <CloseCircleOutlined className="text-2xl" />
        </button>

        <div className="w-full max-w-2xl">
          <SearchBar
            query={query}
            onSearchChange={handleSearchChange}
            showDropdown={false}
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="text-xl mb-6 font-semibold">Search Results</div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton.Button
                key={index}
                active
                style={{
                  width: "100%",
                  height: "0",
                  paddingTop: "150%", 
                  borderRadius: "0.5rem",
                  backgroundColor: "#333",
                }}
              />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-6 justify-center">
              {paginatedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow-md">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="font-medium line-clamp-2 text-center">{movie.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredMovies.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </>
        ) : (
          <div className="text-center text-white mt-10">No results found</div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Search;
