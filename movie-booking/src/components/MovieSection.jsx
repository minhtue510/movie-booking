import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";

const MovieSection = ({ title, movies }) => {
  const isNowPlaying = title === "Now Playing";

  return (
    <div className="mt-6 w-full">
      <h2 className="text-xl font-semibold ml-3">{title}</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={isNowPlaying ? 15 : 10}
        slidesPerView={isNowPlaying ? 1.6 : 3.2}
        centeredSlides={isNowPlaying}
        loop={true}
        grabCursor={true}
        navigation={false}
        pagination={false}
        autoplay={isNowPlaying ? { delay: 2000, disableOnInteraction: false } : false}
        className="mt-5 w-full overflow-hidden"
      >
        {movies.map((movie, index) => (
          <SwiperSlide
            key={index}
            className={`transition-transform duration-300 ease-in-out ${isNowPlaying ? "" : "w-40"}`} // Giữ kích thước cho Popular & Upcoming
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center transition-all duration-500 ease-in-out">
                <div
                  className={`transition-transform duration-500 ease-in-out ${isNowPlaying
                    ? isActive
                      ? "scale-100 shadow-2xl"
                      : "scale-75 opacity-60"
                    : "scale-100"
                    }`}
                >
                  <Link to={`/movie/${movie.id}`} state={{ movie }}>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className={`object-cover rounded-xl ${isNowPlaying ? "w-full h-[500px]" : "w-40 h-[220px]"}`}
                    />
                  </Link>
                </div>

                <div
                  className={`text-center mt-3 transition-opacity duration-500 ${isNowPlaying ? (isActive ? "opacity-100" : "opacity-0 scale-75") : "opacity-100"
                    }`}
                >
                  {isNowPlaying && movie.rating && (
                    <div className="bg-black/80 px-3 py-1 rounded-lg text-yellow-400 text-lg font-bold flex items-center justify-center">
                      ⭐ {movie.rating} <span className="text-sm text-gray-400 ml-2">(1,024)</span>
                    </div>
                  )}
                  <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
                  {isNowPlaying && movie.genres && (
                    <div className="flex gap-2 mt-4 justify-center">
                      {movie.genres.map((genre, i) => (
                        <span key={i} className="px-3 py-1 text-white border border-white rounded-full text-xs">
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




