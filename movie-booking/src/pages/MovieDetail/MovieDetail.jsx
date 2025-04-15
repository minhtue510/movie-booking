import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClockCircleOutlined, CloseCircleOutlined, PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import "swiper/css";
import "swiper/css/free-mode";
import { getMovieDetail, getMovieMedia } from "../../services/getMovies";
import MovieCast from "../../components/MovieCast/MovieCast";
import Header from "../../components/Header/Header";
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedMovie, setTopCast } from '../../redux/store/movieDetailSlice';
import { useTranslation } from "react-i18next";
import { genreTranslations } from "../../locales/genreTranslations";
import { descriptionData } from '../../locales/descriptionTranslations';
const MovieDetail = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const language = i18n.language;
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [trailerURL, setTrailerURL] = useState("");
    const openTrailer = () => setIsTrailerOpen(true);
    const closeTrailer = () => setIsTrailerOpen(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const cachedMovie = useSelector((state) => state.movieDetail.selectedMovie);

    useEffect(() => {
        if (cachedMovie?.id === movieId) {
            setMovie(cachedMovie);
            return;
        }

        const fetchData = async () => {
            const data = await getMovieDetail(movieId);
            const media = await getMovieMedia(movieId);
            if (media.videos.length > 0) {
                setTrailerURL(media.videos[0]);
            }
            const movieData = {
                ...data,
                images: media.images,
                background: media.images[0] || "",
                image: media.images[0] || "",
            };
            setMovie(movieData);
            dispatch(setSelectedMovie(movieData));

            if (media.cast && Array.isArray(media.cast)) {
                dispatch(setTopCast(media.cast));
            }
        };

        fetchData();
    }, [movieId]);




    const handleBooking = () => {
        navigate(`/booking/${movie.id}`, {
            state: {
                title: movie.title,
                image: movie.image,
                background: movie.background
            }
        });
    };

    if (error) return <div className="bg-black text-white text-center py-10">{error}</div>;

    if (!movie) {
        return (
            <div className="bg-black min-h-screen text-white relative">
                <Header />
                <div className="w-full h-[350px]  mb-4" />

                <div className="absolute left-1/2 -translate-x-1/2 top-[90px]">
                    <div className="w-[256px] h-[353px] bg-[#333] animate-pulse rounded-lg shadow-xl" />
                </div>

                <div className="mt-[100px]">
                    <div className="flex justify-center gap-2 mb-2">
                        <div className="w-16 h-4 bg-[#333] animate-pulse rounded-md" />
                    </div>
                    <div className="w-3/4 h-6 mx-auto bg-[#333] animate-pulse rounded-md mb-4" />

                    <div className="flex justify-center gap-2 mb-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-16 h-5 bg-[#333] animate-pulse rounded-full" />
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-4 p-4">
                        <div className="flex gap-2">
                            <div className="w-6 h-4 bg-[#333] animate-pulse rounded" />
                            <div className="w-12 h-4 bg-[#333] animate-pulse rounded" />
                            <div className="w-20 h-4 bg-[#333] animate-pulse rounded" />
                            <div className="w-10 h-6 bg-[#333] animate-pulse rounded" />
                        </div>
                        <div className="w-24 h-8 bg-[#333] animate-pulse rounded" />
                    </div>

                    <div className="space-y-2 mb-6 p-4">
                        <div className="w-full h-4 bg-[#333] animate-pulse rounded" />
                        <div className="w-full h-4 bg-[#333] animate-pulse rounded" />
                        <div className="w-full h-4 bg-[#333] animate-pulse rounded" />
                    </div>

                    <div className="text-lg font-bold mb-2 p-4">{t('topCast')}</div>
                    <div className="flex flex-cols  gap-4 overflow-x-auto p-4">
                        {[...Array(5)].map((_, i) => (

                            <div key={i} className="w-[60px] h-[80px] bg-[#333] rounded-[80px] animate-pulse rounded-3xl" />

                        ))}
                    </div>



                    <div className="p-6 flex justify-center">
                        <div className="w-40 h-10 bg-[#333] animate-pulse rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (

        <div className="bg-black min-h-screen text-white relative">
            <Header />

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black"></div>
                {movie.background && (
                    <img src={movie.background} className="w-full h-[350px] object-cover" />
                )}
            </div>
            <button
                onClick={() => navigate("/home")}
                className="absolute top-6 left-6 w-10 h-10 bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition block md:hidden"
            >
                <CloseCircleOutlined className="text-2xl" />
            </button>


            <div className="absolute left-1/2 -translate-x-1/2 top-[90px]">
                {movie.image && (
                    <img src={movie.image} alt={movie.title} className="w-[256px] h-[353px] rounded-lg shadow-xl" />
                )}
            </div>

            <div className="p-6 mt-[90px]">
                <div className="flex items-center justify-center gap-2">
                    <ClockCircleOutlined className="mr-1 text-gray" />
                    <div className="text-12 font-medium">
                        {`${Math.floor(movie.duration / 60)
                            .toString()
                            .padStart(2,)}h ${(movie.duration % 60)
                                .toString()
                                .padStart(2, "0")}m`}
                    </div>
                </div>
                <h1 className="text-24 font-regular text-center mt-2">{movie.title}</h1>
                <div className="flex justify-center gap-2 mt-4">
                    {movie.genres.map((genre, index) => (
                        <span key={index} className="px-3 py-1 text-10 font-regular text-white border border-white rounded-[10px]">
                            {genreTranslations[genre]?.[currentLang] || genre}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-white text-12 font-medium">{movie.rating}</span>
                        <span className="text-white text-12 font-medium ml-2">
                            {i18n.language === "vi"
                                ? format(new Date(movie.releaseDate), "dd/MM/yyyy")
                                : format(new Date(movie.releaseDate), "dd MMMM yyyy")}
                        </span>
                        <span className="text-black font-bold bg-white ml-2 w-10 h-5 flex items-center justify-center rounded-lg">
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
                    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.65)] backdrop-brightness-50 z-50">
                        <div className="relative bg-black rounded-lg  max-w-3xl w-full shadow-xl">

                            <div className="absolute top-0 right-0 w-12 h-12 z-10 pointer-events-none"></div>
                            <button
                                onClick={closeTrailer}
                                className="absolute -top-10 right-4 bg-[#FF5524] text-white p-2 rounded-full z-20 hover:scale-105 transition-transform duration-200"
                            >
                                <CloseOutlined className="text-xl" />
                            </button>


                            <iframe
                                src={trailerURL}
                                className="w-full h-[300px] sm:h-[400px] md:h-[500px]"
                                allowFullScreen
                                playsInline
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            ></iframe>
                        </div>
                    </div>
                )}

                <div className="mt-4 md:hidden">
                    <p className={`text-gray-300 text-sm transition-all duration-300 ${!showFullDescription ? "line-clamp-3" : ""}`}>
                        {
                            language !== 'vi' && descriptionData[movie.description]
                                ? descriptionData[movie.description][language]
                                : movie.description
                        }
                    </p>
                    {movie.description && movie.description.split(" ").length > 30 && (
                        <button
                            className="text-[#FF5524] text-sm mt-2 hover:underline focus:outline-none"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                            {showFullDescription ? t('seeLess') : t('seeMore')}
                        </button>
                    )}
                </div>


                <div className="mt-4 hidden md:block">
                    <p className="text-gray-300 text-sm">
                        {
                            language !== 'vi' && descriptionData[movie.description]
                                ? descriptionData[movie.description][language]
                                : movie.description
                        }
                    </p>
                </div>


                <div className="mt-6 pb-16 sm:pb-0">
                    <h2 className="text-lg font-bold">{t('topCast')}</h2>
                    <MovieCast movieId={movieId} />
                </div>

                {movie.status !== "upcoming" && (
                    <div
                        className="sm:mt-6 sm:flex sm:justify-center fixed sm:static bottom-4 left-0 w-full flex justify-center z-40"
                    >
                        <button
                            className="bg-[#FF5524] text-white py-2 px-6 rounded-full text-lg shadow-lg hover:bg-[#E0451A] transition duration-300"
                            onClick={handleBooking}
                        >
                            {t('selectSeat')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;
