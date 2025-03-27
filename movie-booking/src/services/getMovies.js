import api from "./config";

export const getMovies = async () => {
    try {
        let allMovies = [];
        let page = 1;
        let totalPages = 1;

        do {
            const response = await api.get(`/movies?page=${page}&pageSize=10`);
            const result = response.data;

            if (!result || !Array.isArray(result.data)) {
                throw new Error("Dữ liệu từ API không hợp lệ");
            }

            allMovies = [...allMovies, ...result.data.map(movie => ({
                id: movie.movieId,
                title: movie.title,
                rating: movie.rating || 0,
                genres: movie.genres.length ? movie.genres : [],
                image: movie.imageMovie.length ? movie.imageMovie[0] : "https://via.placeholder.com/200x300?text=No+Image",
            }))];

            totalPages = result.totalPages;
            page++;
        } while (page <= totalPages);

        return allMovies;
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

        console.log("Dữ liệu trả về từ API:", mediaList);

        if (!Array.isArray(mediaList) || mediaList.length === 0) {
            return { images: [], videos: [] };
        }

        const images = mediaList
            .filter(media => media.mediaType.toLowerCase() === "image")
            .map(media => media.mediaURL);

        const videos = mediaList
            .filter(media => media.mediaType.toLowerCase() === "video")
            .map(media => {
                const videoURL = media.mediaURL;
                let videoId = "";
                
                if (videoURL.includes("youtube.com/watch?v=")) {
                    videoId = videoURL.split("v=")[1]?.split("&")[0];
                } else if (videoURL.includes("youtu.be/")) {
                    videoId = videoURL.split("youtu.be/")[1]?.split("?")[0];
                }

                return videoId
                ? `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&enablejsapi=1&autoplay=1&controls=1`
                : null;
            
            
            })
            .filter(Boolean);

        return { images, videos };
    } catch (error) {
        console.error("Lỗi khi lấy ảnh/phim:", error);
        return { images: [], videos: [] };
    }
};

export const getMovieCast = async (movieId) => {
    try {
        const response = await api.get(`/actors/movie/${movieId}`);
        const castData = response.data?.data?.[0] || []; 
        return castData.map(actor => ({
            id: actor.id,
            name: actor.name,
            image: actor.imageURL, 
            role: actor.role
        }));
    } catch (error) {
        console.error("Lỗi khi lấy danh sách diễn viên:", error);
        return [];
    }
};



