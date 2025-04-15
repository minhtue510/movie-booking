import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { getShowtimes } from "../../services/getSeats";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import SeatSelection from "../../components/SeatSelection/SeatSelection";
import "../Booking/Booking.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFromToken } from "../../redux/store/authSlice";
import { createOrder, createPaymentUrl } from "../../services/createOrder";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header/Header";
import { Skeleton } from 'antd';
dayjs.extend(weekday);

const Booking = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { movieId } = useParams();
  const [movieImage, setMovieImage] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [totalPrice, setTotalPrice] = useState(0);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const timeSwiperRef = useRef(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = location.state;
    if (state?.selectedSeats) {
      setSelectedSeats(state.selectedSeats);
    }
    if (state?.selectedTime) {
      setSelectedTime(state.selectedTime);
      setSelectedDate(state.selectedTime.date);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchUserFromToken());

    const fetchShowtimes = async () => {
      if (!movieId) {
        return;
      }
      try {
        const response = await getShowtimes(movieId);
        const showtimes = response.data || response;
        console.log("Danh sách showtimes từ API:", showtimes);

        if (showtimes.length > 0) {
          const firstShow = showtimes[0];
          if (firstShow.movieImage) setMovieImage(firstShow.movieImage);
          if (firstShow.title) setTitle(firstShow.title);

          const sortedDates = [...new Set(showtimes.map(show => show.date))].sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);
          setDates(sortedDates);

          const allTimes = showtimes.map(show => ({
            date: show.date,
            time: show.time,
            id: show.id,
            price: show.price
          }));
          setTimes(allTimes);

          const now = dayjs();
          const availableShowtimes = allTimes.filter(show => {
            const showDateTime = dayjs(`${show.date} ${show.time}`, "YYYY-MDD HH:mm:ss");
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
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId, dispatch]);

  const filteredTimes = times.filter(time => time.date === selectedDate);

  useEffect(() => {
    const totalSeatPrice = selectedSeats.reduce((total, seat) => {
      return total + (selectedTime.price * seat.priceModifier);
    }, 0);
    setTotalPrice(totalSeatPrice);
  }, [selectedSeats, selectedTime]);

  useEffect(() => {
    if (selectedTime && filteredTimes.length > 0 && timeSwiperRef.current) {
      const index = filteredTimes.findIndex(t => t.id === selectedTime.id);
      if (index !== -1) {
        timeSwiperRef.current.slideTo(index, 300);
      }
    }
  }, [selectedTime, filteredTimes]);

  const handleBuyTicket = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
          selectedSeats,
          selectedTime,
          movieId
        }
      });
      return;
    }

    const selectedSeatsInfo = selectedSeats.map(seat => seat.seatId);
    try {
      const orderResult = await createOrder(
        user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "User Name",
        selectedSeatsInfo,
        selectedTime.id
      );
      const { orderId, totalAmount } = orderResult;
      if (orderId && totalAmount) {
        const paymentUrlResult = await createPaymentUrl(orderId, totalAmount);
        if (paymentUrlResult?.url) {
          window.location.href = paymentUrlResult.url;
        } else {
          alert("Payment URL not available. Please try again.");
        }
      } else {
        alert("Invalid order data. Please try again.");
      }
    } catch (error) {
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <><Header />
      <div className="bg-black min-h-screen text-white relative flex flex-col items-center">
        <div className="relative w-full h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/100"></div>
          {loading ? (
            <Skeleton active className="w-full h-full" />
          ) : (
            movieImage && <img src={movieImage} alt={title} className="w-full h-full object-cover" />
          )}
        </div>

        <button
          onClick={() => navigate(movieId ? `/movies/${movieId}` : "/")}
          className="absolute top-6 left-6 w-10 h-10 bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition  block md:hidden"
        >
          <CloseCircleOutlined className="text-2xl" />
        </button>

        <div className="w-full max-w-md px-4 flex flex-col items-center">
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} />
          ) : (
            selectedTime?.id && (
              <SeatSelection
                setSelectedSeats={setSelectedSeats}
                showtime={selectedTime?.id}
                selectedSeats={selectedSeats}
              />
            )
          )}

          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            dates.length > 0 ? (
              <Swiper spaceBetween={10} slidesPerView={5.5} freeMode={true} modules={[FreeMode]} className="w-full mt-4">
                {dates.map((date, index) => {
                  const formattedDate = dayjs(date);
                  const isPastDate = dayjs().isAfter(formattedDate, "day");
                  if (isPastDate) return null;
                  return (
                    <SwiperSlide key={index} className="flex justify-center">
                      <div
                        onClick={() => !isPastDate && setSelectedDate(date)}
                        className={`w-12 h-20 flex flex-col items-center justify-center rounded-full text-md font-semibold
                                ${isPastDate ? "past-date" : "default-date"} 
                                ${dayjs(selectedDate).isSame(dayjs(date), "day") ? "selected-date" : ""}`}
                      >
                        <span className="text-lg">{formattedDate.format("DD")}</span>
                        <span className="text-sm">
                          {t(`days.${formattedDate.format("ddd").toLowerCase()}`)}
                        </span>

                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <p className="text-center text-gray-400">{t("noMovie")}</p>
            )
          )}

          {selectedDate && (
            <div className="mt-4 w-full text-center">
              {loading ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                filteredTimes.length > 0 ? (
                  <Swiper
                    spaceBetween={5}
                    slidesPerView={4.5}
                    freeMode={true}
                    centeredSlides={true}
                    onSwiper={(swiper) => (timeSwiperRef.current = swiper)}
                    modules={[FreeMode]}
                    className="w-full mt-4"
                  >
                    {filteredTimes.map((showtime, idx) => {
                      const isToday = dayjs(selectedDate).isSame(dayjs(), "day");
                      const isPastTime = isToday && dayjs().isAfter(dayjs(showtime.time, "HH:mm:ss"));
                      return (
                        <SwiperSlide key={idx} className="flex justify-center">
                          <div
                            onClick={() => !isPastTime && setSelectedTime(showtime)}
                            className={`py-2 px-4 rounded-full text-center 
                                  ${isPastTime ? "past-time" : "default-time border border-gray-500"} 
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
                )
              )}
            </div>
          )}

          {dates.length > 0 && selectedTime?.id && (
            <div className="mt-10 flex justify-around items-center w-full">
              <div className="flex flex-col items-center">
                <h1 className="text-sm font-light text-gray-400">
                  {t("price")}
                </h1>
                <h1 className="text-xl">
                  {Math.round(totalPrice).toLocaleString("vi-VN")} VND
                </h1>
              </div>
              <button
                className={`button-buy rounded-full px-6 py-2 
        ${selectedSeats.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF5524] hover:bg-[#e04620]"}`}
                disabled={selectedSeats.length === 0}
                onClick={handleBuyTicket}
              >
                {t("buyTicket")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Booking;
