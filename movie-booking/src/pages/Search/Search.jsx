import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import BottomNav from "../../components/BottomNav/BottomNav";
import { Pagination, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setMovies } from "../../redux/store/movieSlice";
import "../Search/Search.css";
import { useTranslation } from "react-i18next";
import { getMovies } from "../../services/getMovies";
const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Thêm trạng thái cho debounce
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 639);
  const movieCache = useSelector((state) => state.movieCache);
  const { nowPlaying, upcoming, popular, loaded } = movieCache;
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 639);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allMovies = useMemo(() => {
    const uniqueMap = new Map();
    [...nowPlaying, ...upcoming, ...popular].forEach((movie) => {
      uniqueMap.set(movie.id, movie);
    });
    return Array.from(uniqueMap.values());
  }, [nowPlaying, upcoming, popular]);

  useEffect(() => {
    if (!loaded) {
      const fetchMovies = async () => {
        const data = await getMovies();
        const nowPlaying = [], upcoming = [], popular = [];

        data.forEach((movie) => {
          if (movie.status === "playing") nowPlaying.push(movie);
          if (movie.status === "upcoming") upcoming.push(movie);
          if (movie.rating >= 7) popular.push(movie);
        });

        dispatch(setMovies({ nowPlaying, upcoming, popular }));
      };

      fetchMovies();
    }
  }, [loaded, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("query") || "");
  }, [location]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query); // Cập nhật giá trị debounce sau 300ms
    }, 300);

    return () => {
      clearTimeout(handler); // Xóa timeout nếu người dùng tiếp tục gõ
    };
  }, [query]);

  const removeVietnameseTones = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const filteredMovies = useMemo(() => {
    if (!debouncedQuery.trim()) return allMovies;

    const lowerQuery = debouncedQuery.toLowerCase();
    const queryNoTone = removeVietnameseTones(lowerQuery);

    const exactMatches = [];
    const partialMatches = [];

    allMovies.forEach((movie) => {
      const title = movie.title.toLowerCase();
      const titleNoTone = removeVietnameseTones(title);

      if (titleNoTone === queryNoTone) exactMatches.push(movie);
      else if (titleNoTone.includes(queryNoTone)) partialMatches.push(movie);
    });

    return [...exactMatches, ...partialMatches];
  }, [debouncedQuery, allMovies]);

  const handleSearchChange = (value) => {
    setQuery(value); // Cập nhật giá trị query ngay lập tức
    setCurrentPage(1);
    navigate(`/search?query=${value}`);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedMovies = useMemo(() => {
    if (isMobile) return filteredMovies;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMovies.slice(startIndex, startIndex + pageSize);
  }, [filteredMovies, currentPage, isMobile]);

  return (
    <>
      <div className="bg-black min-h-screen text-white px-4 sm:px-6 md:px-10 pb-16">
        {/* Thanh tìm kiếm */}
       <div className="flex justify-center items-center relative md:hidden">
  <div className="w-full max-w-md sm:max-w-lg mt-5">
    <SearchBar query={query} onSearchChange={handleSearchChange} />
  </div>
</div>

        {/* Tiêu đề kết quả */}
        <div className="text-xl pt-8 pb-8 font-semibold">{t("searchResult")}</div>

        {/* Hiển thị kết quả */}
        {!loaded ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-10 gap-y-10 justify-center">
            {paginatedMovies.map((movie) => (
              <div
                key={movie.id}
                className="cursor-pointer"
                onClick={() => navigate(`/movies/${movie.id}`)}
              >
                <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow-md">
                  <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 text-sm">
                  <p className="font-medium line-clamp-2 text-center">{movie.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white mt-10">{t("searchEmpty")}</div>
        )}

        {!isMobile && filteredMovies.length > pageSize && (
          <div className="flex justify-center p-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredMovies.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        )}
      </div>

      {/* Thanh điều hướng dưới */}
      <BottomNav />
    </>
  );
};

export default Search;