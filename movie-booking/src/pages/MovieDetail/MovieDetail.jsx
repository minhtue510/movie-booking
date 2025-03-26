import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { getMovieDetail, getMovieMedia } from "../../services/getMovies";

const MovieDetail = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchMovieDetails = async () => {
            console.log("Fetching movie:", movieId);
            const data = await getMovieDetail(movieId);
            const images = await getMovieMedia(movieId);

            if (!data) {
                setError("Movie not found!");
            } else {
                setMovie({
                    ...data,
                    images,
                    background: images.length > 0 ? images[0] : "", 
                    image: images.length > 0 ? images[0] : ""      
                });
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (error || !movie) return <div className="bg-black"> {error || ""}</div>;

    return (
        <div className="bg-black min-h-screen text-white relative">

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black"></div>
                {movie.background && (
                    <img src={movie.background} alt={movie.title} className="w-full h-[300px] object-fill" />
                )}
            </div>


            <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black transition">
                <CloseCircleOutlined className="text-2xl" />
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 top-[90px]">
                {movie.image && (
                    <img src={movie.image} alt={movie.title} className="w-[256px] h-[353px] rounded-lg shadow-xl" />
                )}
            </div>

 
            <div className="p-6 mt-[115px]">
                <div className="flex items-center justify-center text-gray-300 mt-3 gap-1">
                    <ClockCircleOutlined className="text-white text-lg mr-1" />
                    <span>{movie.duration}</span>
                </div>

                <h1 className="text-2xl font-bold text-center mt-2">{movie.title}</h1>

            
                <div className="flex justify-center gap-2 mt-4">
                    {movie.genres.map((genre, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-semibold text-white border border-white rounded-[10px]">
                            {genre}
                        </span>
                    ))}
                </div>

                <p className="text-center text-gray-400 italic mt-3">{movie.tagline}</p>
                <div className="flex items-center gap-3 mt-4">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="text-white font-semibold">{movie.rating} / 10</span>
                    <span className="text-gray-300">{movie.releaseDate}</span>
                </div>

                <p className="text-gray-300 text-sm mt-4">{movie.description}</p>


                <div className="mt-6">
                    <h2 className="text-lg font-bold">Top Cast</h2>
                    <Swiper slidesPerView={5} spaceBetween={15} freeMode={true} modules={[FreeMode]} className="mt-4 px-4">
                        {movie.cast.length > 0 ? (
                            movie.cast.map((actor, index) => (
                                <SwiperSlide key={index} className="flex flex-col items-center">
                                    <img src={actor.img} alt={actor.name} className="w-[80px] h-[100px] object-cover rounded-[25px] border-2 border-gray-600 shadow-lg" />
                                    <span className="text-gray-300 mt-2 text-center">{actor.name}</span>
                                </SwiperSlide>
                            ))
                        ) : (
                            <p className="text-gray-400">No cast information available.</p>
                        )}
                    </Swiper>
                </div>

                <div className="mt-6 flex justify-center">
                    {movie.status !== "upcoming" && (
                        <button className="bg-[#FF5524] text-white py-2 px-6 rounded-full text-lg shadow-lg hover:bg-[#E0451A] transition duration-300" onClick={() => navigate(`/booking/${movie.id}`)}>
                            Select Seats
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
