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
        if (Array.isArray(response.data)) {
            return response.data;  
        } else {
            console.error("Dữ liệu không phải là mảng:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching booked seats:", error);
        return [];
    }
};








