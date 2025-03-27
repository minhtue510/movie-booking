import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClockCircleOutlined, CloseCircleOutlined, PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { getMovieDetail, getMovieMedia } from "../../services/getMovies";
import MovieCast from "../../components/MovieCast";

const MovieDetail = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [trailerURL, setTrailerURL] = useState("");
    const openTrailer = () => setIsTrailerOpen(true);
    const closeTrailer = () => setIsTrailerOpen(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            console.log("Fetching movie:", movieId);
            const data = await getMovieDetail(movieId);
            const media = await getMovieMedia(movieId);
            if (!data) {
                setError("Movie not found!");
            } else {
                setMovie({
                    ...data,
                    images: media.images,
                    background: media.images.length > 0 ? media.images[0] : "",
                    image: media.images.length > 0 ? media.images[0] : ""
                });
                if (media.videos.length > 0) {
                    setTrailerURL(media.videos[0]);
                }
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
            <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition">
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
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white font-semibold">{movie.rating}</span>
                        <span className="text-gray-300 ml-2">
                            {format(new Date(movie.releaseDate), "dd MMMM yyyy")}
                        </span>
                        <span className="text-black font-bold bg-white ml-2 w-10 flex items-center justify-center rounded-lg">
                            {movie.ageRating.split("-")[0]}
                        </span>
                    </div>
                    {trailerURL && (
                        <button
                            onClick={openTrailer}
                            className="flex items-center gap-2 text-white bg-[#FF5524] font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-[#FF5524] transition">
                            <PlayCircleOutlined className="text-xl" />
                            Trailer
                        </button>
                    )}
                </div>
                {isTrailerOpen && trailerURL && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className="relative bg-black rounded-lg overflow-hidden max-w-3xl w-full shadow-xl">
                            <button
                                onClick={closeTrailer}
                                className="absolute top-2 right-2 bg-[#FF5524] text-white p-2 rounded-full hover:bg-[#FF5524]">
                                <CloseOutlined className="text-xl" />
                            </button>
                            <iframe
                                src={`${trailerURL}`}
                                className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
                                allowFullScreen                   
                                playsInline
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            ></iframe>
                        </div>
                    </div>
                )}
                <p className="text-gray-300 text-sm mt-4">{movie.description}</p>
                <div className="mt-6">
                    <h2 className="text-lg font-bold">Top Cast</h2>
                     <MovieCast movieId={movieId} />
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
