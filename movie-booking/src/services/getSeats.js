import api from "./config";

export const getShowtimes= async (movieId) => {
    try {
      const response = await api.get(`/bookings/showtimes/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      return null;
    }
  };

  export const getSeats = async (showtimeId) => {
      try {
          const response = await api.get(`/bookings/seats/${showtimeId}`);
            const data = response.data; 

          if (data && Array.isArray(data.data)) {
              console.log("Danh sách ghế:", data.data);
              return data.data;
          } else {
              console.log("API trả về dữ liệu không đúng định dạng.");
              return [];
          }
      } catch (error) {
          console.error("Lỗi khi gọi API:", error);
          return [];
      }
  };
  
  export const checkSeat = async (showtimeId) => {
    try {
        const response = await api.get(`/bookings/booked-seat/${showtimeId}`);
        console.log("Dữ liệu trả về từ API:", response.data);

        // Kiểm tra xem dữ liệu trả về có phải là một mảng không
        if (Array.isArray(response.data)) {
            console.log("Các ghế đã đặt (seatId):", response.data);
            return response.data;  // Trả về trực tiếp mảng seatId nếu đúng định dạng
        } else {
            console.error("Dữ liệu không phải là mảng:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching booked seats:", error);
        return [];
    }
};








