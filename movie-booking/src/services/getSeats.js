import api from "./config";

export const getShowtimes = async (movieId) => {
    try {
        let allShowtimes = [];
        let page = 1;
        const pageSize = 100; 
        while (true) {
            const response = await api.get(`/bookings/showtimes/${movieId}?page=${page}&pageSize=${pageSize}`);
            const showtimes = response.data.data; 
            if (!showtimes || showtimes.length === 0) {
                break;
            }
            allShowtimes = [...allShowtimes, ...showtimes];
            if (showtimes.length < pageSize) {
                break; 
            }
            page++;
        }

        return allShowtimes; 
    } catch (error) {
        console.error("Lỗi khi gọi API suất chiếu:", error);
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








