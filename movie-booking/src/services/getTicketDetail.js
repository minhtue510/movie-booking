import api from "./config";

export const getTicketDetail = async (userId, movieId) => {
  try {
    const response = await api.get(`/orders/movies/${userId}/tickets/${movieId}`);
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết vé:", error);
    throw error; 
  }
};
