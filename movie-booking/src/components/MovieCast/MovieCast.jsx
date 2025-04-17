import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { useDispatch, useSelector } from "react-redux"; 
import { setTopCast } from "../../redux/store/movieDetailSlice"; 
import { getMovieCast } from "../../services/getMovies"; 

const MovieCast = ({ movieId }) => {
  const dispatch = useDispatch();
  const topCast = useSelector(state => state.movieDetail.topCast[movieId] || []);

  useEffect(() => {
    if (movieId && topCast.length === 0) {
      const fetchCast = async () => {
        const data = await getMovieCast(movieId);
        dispatch(setTopCast({ movieId, cast: data })); 
      };

      fetchCast();
    }
  }, [movieId, dispatch, topCast.length]); 

  return (
    <Swiper
      freeMode={true}
      modules={[FreeMode]}
      className="mt-4"
      breakpoints={{
        0: {
          slidesPerView: 3.2,
          spaceBetween: 12,
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 14,
        },
        768: {
          slidesPerView: 5,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 18,
        },
        1280: {
          slidesPerView: 7,
          spaceBetween: 20,
        },
      }}
    >
      {topCast.length > 0 ? (
        topCast.map((actor) => (
          <SwiperSlide key={actor.id} className="flex flex-col items-center">
            <img
              src={actor.image}
              alt={actor.name}
              className="rounded-full border border-gray-600 shadow-lg
                         w-[60px] h-[70px] sm:w-[70px] sm:h-[80px] sm:rounded[70%] md:w-[80px] md:h-[90px] lg:w-[90px] lg:h-[100px]"
            />
            <span className="text-white mt-2 text-center font-medium text-[10px] sm:text-[11px] md:text-sm lg:text-base">
              {actor.name}
            </span>
            <p className="text-white text-center font-light text-[9px] sm:text-[10px] md:text-xs lg:text-sm">
              {actor.role}
            </p>
          </SwiperSlide>
        ))
      ) : (
        <p className="text-gray-400">No cast information available.</p>
      )}
    </Swiper>
  );
};

export default MovieCast;
