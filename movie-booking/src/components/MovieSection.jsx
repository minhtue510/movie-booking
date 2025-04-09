import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import { Navigation, Autoplay } from "swiper/modules";


const MovieSection = ({ title, movies }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isNowPlaying = title === "Now Playing";
  const shouldShowTitle = !(isNowPlaying && !isMobile);

  const getSlidesPerView = () => {
    if (!isNowPlaying) return isMobile ? 2.2 : 5;
    if (isMobile) return 1.5; // 1 chính giữa + 2 nửa bên
    if (windowWidth >= 1280) return 3;
    if (windowWidth >= 1024) return 2.8;
    return 2;
  };

  const getSpaceBetween = () => {
    if (isNowPlaying) return isMobile ? 10 : 15; 
    return 15;
  };

  const getImageSize = () => {
    if (!isNowPlaying) return "w-44 h-[220px]";
    if (isMobile) return "w-full h-[400px]";
    if (windowWidth >= 1280) return "w-[350px] h-[500px]";
    if (windowWidth >= 1024) return "w-[300px] h-[450px]";
    return "w-[250px] h-[400px]";
  };

  return (
    <div className="mt-6 w-full">
      {shouldShowTitle && (
        <h2 className="text-xl font-semibold ml-3 text-custom-red mb-4">
          {title}
        </h2>
      )}

<Swiper
  modules={[Navigation, Autoplay]}
  spaceBetween={getSpaceBetween()}
  slidesPerView={getSlidesPerView()}
  centeredSlides={isNowPlaying}
  loop={movies.length >= 3}
  grabCursor={true}
  navigation={false}
  pagination={false}
  autoplay={
    isNowPlaying ? { delay: 3000, disableOnInteraction: false } : false
  }
  className={`mt-2 w-full px-3 ${
    isNowPlaying ? "" : ""
  } overflow-visible`}
>

        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div className="flex flex-col items-center transition-all duration-500 ease-in-out">
                <div
                  className={`transition-transform duration-500 ease-in-out ${
                    isNowPlaying
                      ? isActive
                        ? "scale-100 shadow-2xl z-30"
                        : "scale-75 opacity-60 z-10"
                      : "scale-100"
                  }`}
                >
                  <Link to={`/movies/${movie.id}`} state={{ movie }}>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className={`object-cover rounded-xl ${getImageSize()} shadow-md`}
                    />
                  </Link>
                </div>

                <div
                  className={`text-center mt-3 transition-opacity duration-500 ${
                    isNowPlaying
                      ? isActive
                        ? "opacity-100"
                        : "opacity-0 scale-75"
                      : "opacity-100"
                  }`}
                >
                  {isNowPlaying && movie.rating && (
                    <div className="bg-black/80 px-3 py-1 rounded-lg text-yellow-400 text-lg font-bold flex items-center justify-center">
                      ⭐ {movie.rating}
                    </div>
                  )}
                  <h3 className="text-white font-semibold text-base mt-1">
                    {movie.title}
                  </h3>
                  {isNowPlaying && movie.genres && (
                    <div className="flex gap-2 mt-3 justify-center flex-wrap">
                      {movie.genres.map((genre, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-white border border-white rounded-full text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieSection;
