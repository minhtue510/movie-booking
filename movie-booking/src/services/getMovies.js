import api from "./config";

export const getMovies = async () => {
    try {
        const response = await api.get("/movies");
        const result = response.data;

        if (!result || !Array.isArray(result.data)) {
            throw new Error("Dữ liệu từ API không hợp lệ");
        }

        return result.data.map(movie => ({
            id: movie.movieId,
            title: movie.title,
            rating: movie.rating || 0,
            genres: movie.genres.length ? movie.genres : [],
            image: movie.imageMovie.length ? movie.imageMovie[0] : "https://via.placeholder.com/200x300?text=No+Image",
        }));
    } catch (error) {
        console.error("Lỗi khi gọi API movies:", error);
        return [];
    }
};

export const getMovieDetail = async (movieId) => {
    try {
        const response = await api.get(`/movies/${movieId}`);
        const movie = response.data;  

        if (!movie) {
            throw new Error("Không tìm thấy dữ liệu phim");
        }

        return {
            id: movie.movieId,
            title: movie.title,
            description: movie.description,
            nation: movie.nation,
            status: movie.status,
            duration: movie.duration,
            rating: movie.rating,
            releaseDate: movie.releaseDate,
            ageRating: movie.ageRating,
            genres: movie.genres || [],
            image: movie.imageMovie?.[0] || "https://via.placeholder.com/200x300?text=No+Image",
            background: movie.background || "https://via.placeholder.com/800x450?text=No+Background",
            cast: movie.cast || []
        };
    } catch (error) {
        console.error("Lỗi khi gọi API movie detail:", error);
        return null;
    }
};

export const getMovieMedia = async (movieId) => {
    try {
        const response = await api.get(`/movie-medias/get-by-movie/${movieId}`);
        const mediaList = response.data; 

        if (!Array.isArray(mediaList) || mediaList.length === 0) {
            return [];
        }

        return mediaList.map(media => media.mediaURL);
    } catch (error) {
        console.error("Lỗi khi lấy ảnh phim:", error);
        return [];
    }
};
