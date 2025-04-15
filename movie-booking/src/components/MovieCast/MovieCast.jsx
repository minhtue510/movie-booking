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
      slidesPerView={5}
      spaceBetween={20}
      freeMode={true}
      modules={[FreeMode]}
      className="mt-4"
    >
      {topCast.length > 0 ? (
        topCast.map((actor) => (
          <SwiperSlide key={actor.id} className="flex flex-col items-center">
            <img
              src={actor.image}
              alt={actor.name}
              className="w-[80px] h-[90px] object-cover rounded-[50px] border border-gray-600 shadow-lg"
            />
            <span className="text-white mt-2 text-center font-medium text-10">{actor.name}</span>
            <p className="text-white text-center font-light text-10">{actor.role}</p>
          </SwiperSlide>
        ))
      ) : (
        <p className="text-gray-400">No cast information available.</p>
      )}
    </Swiper>
  );
};

export default MovieCast;
