import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { getShowtimes } from "../../services/getSeats";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import SeatSelection from "../../components/SeatSelection";
import "../Booking/Booking.css";
dayjs.extend(weekday);

const Booking = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { title, image, background } = location.state || {};
    const [dates, setDates] = useState([]);
    const [times, setTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        const fetchShowtimes = async () => {
            if (!movieId) {
                console.log("Không có movieId");
                return;
            }
            try {
                const response = await getShowtimes(movieId);
                const showtimes = response.data || response;
                console.log("Showtimes: ", showtimes);

                if (showtimes.length > 0) {
                    const sortedDates = [...new Set(showtimes.map(show => show.date))].sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
                    setDates(sortedDates);

                    const allTimes = showtimes.map(show => ({
                        date: show.date,
                        time: show.time,
                        id: show.id
                    }));
                    setTimes(allTimes);

                    // 🔹 Lọc các suất chiếu hợp lệ (chưa quá giờ)
                    const now = dayjs();
                    const availableShowtimes = allTimes.filter(show => {
                        const showDateTime = dayjs(`${show.date} ${show.time}`, "YYYY-MM-DD HH:mm:ss");
                        return showDateTime.isAfter(now);
                    });

                    if (availableShowtimes.length > 0) {
                        const earliestShowtime = availableShowtimes.sort((a, b) => dayjs(`${a.date} ${a.time}`).diff(dayjs(`${b.date} ${b.time}`)))[0];

                        setSelectedDate(earliestShowtime.date);
                        setSelectedTime(earliestShowtime);
                    } else {
                        console.log("Không có suất chiếu nào có thể đặt.");
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy showtimes:", error);
            }
        };

        fetchShowtimes();
    }, [movieId]);

    const filteredTimes = times.filter(time => time.date === selectedDate);
    const handleTimeSelect = (showtime) => setSelectedTime(showtime);

    return (
        <div className="bg-black min-h-screen text-white relative flex flex-col items-center">
          <div className="relative w-full h-[350px]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/100"></div>
            {background && <img src={background} alt={title} className="w-full h-full object-fill" />}
          </div>
    
          <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition">
            <CloseCircleOutlined className="text-2xl" />
          </button>
    
          <div className="w-full max-w-md px-4 flex flex-col items-center mb-[100px]">
            {selectedTime?.id && <SeatSelection showtime={selectedTime.id} />}
            {dates.length > 0 ? (
              <Swiper spaceBetween={10} slidesPerView={5.5} freeMode={true} modules={[FreeMode]} className="w-full mt-4">
                {dates.map((date, index) => {
                  const formattedDate = dayjs(date);
                  const isPastDate = dayjs().isAfter(formattedDate, "day");
                  return (
                    <SwiperSlide key={index} className="flex justify-center">
                      <div
                        onClick={() => !isPastDate && setSelectedDate(date)}
                        className={`w-16 h-14 flex flex-col items-center justify-center rounded-lg text-md font-semibold
                        ${isPastDate ? "past-date" : "default-date"} 
                        ${dayjs(selectedDate).isSame(dayjs(date), "day") ? "selected-date" : ""}`}
                      >
                        <span className="text-lg">{formattedDate.format("DD")}</span>
                        <span className="text-sm">{formattedDate.format("ddd")}</span>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <p className="text-center text-gray-400">No showtimes available.</p>
            )}
    
            {selectedDate && (
              <div className="mt-4 w-full text-center">
                {filteredTimes.length > 0 ? (
                  <Swiper spaceBetween={5} slidesPerView={4.5} freeMode={true} modules={[FreeMode]} className="w-full mt-4">
                    {filteredTimes.map((showtime, idx) => {
                      const isToday = dayjs(selectedDate).isSame(dayjs(), "day");
                      const isPastTime = isToday && dayjs().isAfter(dayjs(showtime.time, "HH:mm:ss"));
                      return (
                        <SwiperSlide key={idx} className="flex justify-center">
                          <div
                            onClick={() => !isPastTime && handleTimeSelect(showtime)}
                            className={`py-2 px-4 rounded-lg text-center
                            ${isPastTime ? "past-time" : "default-time"} 
                            ${selectedTime?.id === showtime.id ? "selected-time" : ""}`}
                          >
                            {dayjs(showtime.time, "HH:mm:ss").format("HH:mm")}
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                ) : (
                  <p className="text-gray-400">No showtimes available for this date.</p>
                )}
              </div>
            )}
    
            <h1>Total Price:</h1>
            <button className="button-buy">Buy Ticket</button>
          </div>
    
        </div>
      );
    };
    
    export default Booking;