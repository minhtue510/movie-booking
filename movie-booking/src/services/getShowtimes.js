import api from "./config";

export const getShowtimes = async () => {
    try {
      const response = await api.get(`/showtimes`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      return []; 
    }
  };