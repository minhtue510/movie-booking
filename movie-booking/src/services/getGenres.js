import api from "./config";

export const getGenres = async () => {
    try {
      const response = await api.get(`/genres`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thể loại phim:", error);
      return []; 
    }
  };
  