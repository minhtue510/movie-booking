import api from "./config";

export const getOrderDetail = async (orderId) => {
  try {
    const response = await api.get(`/tickets/ticket/${orderId}`);
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết vé:", error);
    throw error; 
  }
};

