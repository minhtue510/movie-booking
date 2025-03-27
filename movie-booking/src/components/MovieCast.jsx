import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { getMovieCast } from "../services/getMovies";

const MovieCast = ({ movieId }) => {
    const [cast, setCast] = useState([]);

    useEffect(() => {
        const fetchCast = async () => {
            const data = await getMovieCast(movieId);
            setCast(data);
        };

        if (movieId) fetchCast();
    }, [movieId]);

    return (
        <Swiper
            slidesPerView={5}
            spaceBetween={10}
            freeMode={true}
            modules={[FreeMode]}
            className="mt-4 "
        >
            {cast.length > 0 ? (
                cast.map((actor) => (
                    <SwiperSlide key={actor.id} className="flex flex-col items-center">
                        <img
                            src={actor.image}
                            alt={actor.name}
                            className="w-[80px] h-[90px] object-cover rounded-[50px] border-2 border-gray-600 shadow-lg"
                        />
                        <span className="text-gray-300 mt-2 text-center">{actor.name}</span>
                        <p className="text-xs text-gray-400 text-center">{actor.role}</p>
                    </SwiperSlide>
                ))
            ) : (
                <p className="text-gray-400">No cast information available.</p>
            )}
        </Swiper>
    );
};

export default MovieCast;