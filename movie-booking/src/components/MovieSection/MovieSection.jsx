import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "./MovieSection.css";
import { useTranslation } from "react-i18next";
import { genreTranslations } from "../../locales/genreTranslations";

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => {
      const currentWidth = window.innerWidth;
      setIsMobile(currentWidth <= 768);
      setWidth(currentWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { isMobile, width };
};

const NowPlayingSkeleton = () => {
  const { width } = useResponsive();
  let slides = 3;
  if (width >= 1024) slides = 5;
  else if (width >= 768) slides = 3;
  return (
    <div
      className={`mt-2 w-full px-3 flex gap-2 md:gap-4 xl:gap-6 ${width < 768 ? 'justify-center' : 'justify-around'
        }`}
    >
      {Array.from({ length: slides }).map((_, index) => {
        const isMobile = width < 768;
        const centerIndex = Math.floor(slides / 2);
        const isCenter = index === centerIndex;
        const sizeClass = isMobile
          ? isCenter
            ? "w-[250px] h-[400px]"
            : "w-[200px] h-[400px]"
          : isCenter
            ? "w-[280px] h-[440px]"
            : "w-[263px] h-[375px]";

        const scaleClass = isMobile
          ? isCenter
            ? "scale-100 z-20"
            : "scale-75 opacity-60 z-10"
          : isCenter
            ? "scale-105 z-20 shadow-2xl"
            : "scale-90 opacity-70 z-10";
        return (
          <div
            key={index}
            className={`flex flex-col items-center transition-transform duration-300 ${scaleClass}`}
          >
            <div className={`${sizeClass} bg-[#333] animate-pulse rounded-xl`} />

            {isCenter && (
              <div className="text-center mt-3">
                <div className="w-10 h-4 bg-[#333] animate-pulse rounded-xl mb-2 mx-auto" />
                <div className="w-24 h-6 bg-[#333] animate-pulse rounded-xl mx-auto" />
                <div className="mt-3 flex gap-2 justify-center">
                  <div className="w-16 h-4 bg-[#333] animate-pulse rounded-xl" />
                  <div className="w-16 h-4 bg-[#333] animate-pulse rounded-xl" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const UpcomingPopularSkeleton = ({ spaceBetween, slidesPerView }) => (
  <Swiper
    spaceBetween={spaceBetween}
    slidesPerView={slidesPerView}
    className="mt-2 w-full px-6"
    grabCursor
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <SwiperSlide key={index}>
        <div className="flex flex-col items-center">
          <div className="w-35 h-[200px] bg-[#333] animate-pulse rounded-xl mb-4" />
          <div className="text-center mt-3">
            <div className="w-24 h-4 bg-[#333] animate-pulse rounded-xl mb-2" />
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

const MovieSection = ({ titleKey, movies }) => {
  const { t, i18n } = useTranslation();
  const title = t(`home.${titleKey}`);
  const { isMobile, width } = useResponsive();
  const [isLoading, setIsLoading] = useState(true);
  const currentLang = i18n.language 

  const isNowPlaying = titleKey === "nowPlaying";
  const isUpcomingOrPopular = titleKey === "upcoming" || titleKey === "popular";

  useEffect(() => {
    setIsLoading(!(movies && movies.length > 0));
  }, [movies]);

  const getSpaceBetween = () => (isNowPlaying ? (isMobile ? 10 : 10) : 10);

  const getSlidesPerView = () => {
    if (isNowPlaying) {
      if (isMobile) return 1.5;
      if (width >= 1280) return 5;
      if (width >= 1024) return 3;
      return 2;
    }
    return isMobile ? 2.2 : 5;
  };

  const getImageSize = () => {
    if (isNowPlaying) {
      if (isMobile) return "w-full h-[400px]";
      if (width >= 1280) return "w-[350px] h-[500px]";
      if (width >= 1024) return "w-[300px] h-[450px]";
      return "w-[250px] h-[400px]";
    }
    return "w-44 h-[220px]";
  };

  return (
    <div className="mt-6 w-full">
      <h2 className="text-xl font-semibold ml-3 text-custom-red mb-4">{title}</h2>

      {isLoading ? (
        isNowPlaying ? (
          <NowPlayingSkeleton />
        ) : (
          <UpcomingPopularSkeleton
            spaceBetween={getSpaceBetween()}
            slidesPerView={getSlidesPerView()}
          />
        )
      ) : (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={getSpaceBetween()}
          slidesPerView={getSlidesPerView()}
          centeredSlides={isNowPlaying}
          loop={movies.length >= 3}
          grabCursor
          autoplay={
            isNowPlaying ? { delay: 3000, disableOnInteraction: false } : false
          }
          className="mt-2 w-full px-3 overflow-visible"
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <div className="flex flex-col items-center transition-all duration-500">
                  <div
                    className={`transition-transform duration-500 ${isNowPlaying
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
                    className={`text-center mt-3 transition-opacity duration-500 ${isNowPlaying
                      ? isActive
                        ? "opacity-100"
                        : "opacity-0 scale-75"
                      : "opacity-100"
                      }`}
                  >
                    {isNowPlaying && movie.rating != null && (
                      <div className="bg-black/80 px-3 py-1 rounded-lg text-yellow-400 text-sm font-bold flex justify-center">
                        ⭐ {Number.isInteger(movie.rating) ? movie.rating : movie.rating.toFixed(1)}
                      </div>
                    )}

                    <h3
                      className="text-white font-semibold text-base mt-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {movie.title}
                    </h3>

                    {isNowPlaying && movie.genres && (
                      <div className="flex gap-2 mt-3 justify-center flex-wrap">
                        <div className="flex justify-center gap-2 mt-4">
                          {movie.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-xs font-semibold text-white border border-white rounded-[10px]"
                            >
                              {genreTranslations[genre]?.[currentLang] || genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default MovieSection;
