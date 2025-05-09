import api from "./config";

export const getTotalAmount = async () => {
  try {
    const response = await api.get(`/revenue/total-amount`);
    return response.data.data[0];
  } catch (error) {
    console.error("Lỗi khi lấy tổng doanh thu:", error);
    return 0; 
  }
};

  export const getRevenue = async  (params = {}) => {
    try {
      const response = await api.get(`/revenue`,{ params });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu:", error);
      return [];
    }
  };

  export const getRevenueByMovie = async () => {
    try {
      const response = await api.get(`/revenue/movie`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy thể loại phim:", error);
      return []; 
    }
  };

  
  