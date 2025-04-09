import api from "./config";

export const getHistory = async (userId) => {
    try {
      const response = await api.get(`/orders/movies/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
      return []; 
    }
  };
  