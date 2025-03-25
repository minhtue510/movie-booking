import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import movieData from "../../data/movies.json";
import { CloseCircleOutlined } from "@ant-design/icons";
import SeatSelection from "../../components/SeatSelection";
import availableIcon from "../../assets/icon/available.svg";
import selectedIcon from "../../assets/icon/selected.svg";
import takenIcon from "../../assets/icon/taken.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";

const Booking = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const movie = movieData.movies.find(m => m.id === Number(movieId));
    const [selectedDate, setSelectedDate] = useState("18 Mon");
    const [selectedTime, setSelectedTime] = useState("14:30");
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const halls = {
        "10:30": "01",
        "12:30": "02",
        "14:30": "03",
        "15:30": "04",
        "16:30": "05",
        "17:00": "06",
        "17:30": "07",
    };

    const dates = ["17 Sun", "18 Mon", "19 Tue", "20 Wed", "21 Thu", "22 Fri", "23 Sat", "24 Sun"];
    const times = Object.keys(halls);

    const calculateTotalPrice = (seats) => {
        setTotalPrice(seats.length * 15);
    };

    if (!movie) {
        return <div className="text-white text-center mt-10">Movie not found!</div>;
    }

    return (
        <div className="bg-black min-h-screen text-white relative flex flex-col items-center">
            <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-b to-black"></div>
                <img src={movie.background} alt={movie.title} className="w-full h-[210px] object-cover" />
            </div>
            <button
                onClick={() => navigate(-1)}
                className="absolute top-7 left-12 w-[34px] h-[34px] bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition"
            >
                <CloseCircleOutlined className="text-xl" />
            </button>

            <h1 className="text-center text-gray-500 ">Screen this side</h1>

            <div className="mt-6 flex justify-center w-full">
                <div className="max-w-lg w-full">
                    <SeatSelection
                        onSeatSelect={(seats) => {
                            setSelectedSeats(seats);
                            calculateTotalPrice(seats);
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-around w-full max-w-md mt-4 text-sm">
                <div className="flex items-center gap-1">
                    <img src={availableIcon} alt="Available" className="w-6 h-6" />
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                    <img src={takenIcon} alt="Taken" className="w-6 h-6" />
                    <span>Taken</span>
                </div>
                <div className="flex items-center gap-1">
                    <img src={selectedIcon} alt="Selected" className="w-6 h-6" />
                    <span>Selected</span>
                </div>
            </div>


            <div className="mt-6 w-full">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={5.5}
                    freeMode={true}
                    modules={[FreeMode]} // Kích hoạt FreeMode để vuốt tự do
                    className="w-full"
                >
                    {dates.map((date, index) => (
                        <SwiperSlide key={index} className="flex justify-center">
                            <button
                                className={`w-14 h-20 rounded-full flex flex-col items-center justify-center text-md ${date === selectedDate ? "bg-[#FF5524]" : "bg-black"
                                    }`}
                                onClick={() => setSelectedDate(date)}
                            >
                                {date.split(" ")[0]}
                                <span className="text-xs">{date.split(" ")[1]}</span>
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="mt-4 w-full">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={4.5}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="w-full"
                >
                    {times.map((time, index) => (
                        <SwiperSlide key={index} className="flex justify-center">
                            <button
                                className={`px-4 py-2 rounded-full text-sm shrink-0 ${time === selectedTime ? "bg-[#FF5524]" : "bg-black border border-white"
                                    }`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {time}
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="p-6 mt-6 flex justify-around items-center w-full max-w-md">
                <div className="flex flex-col items-center text-center">
                    <p className="text-gray-400 text-lg">Total Price</p>
                    <p className="text-white text-xl font-semibold">${totalPrice}</p>
                </div>

                <button
                    onClick={() => {
                        const ticketData = {
                            movie,
                            selectedDate,
                            selectedTime,
                            hall: halls[selectedTime],
                            selectedSeats,
                            totalPrice
                        };

                        const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
                        localStorage.setItem("tickets", JSON.stringify([...storedTickets, ticketData]));
                        navigate("/tickets");
                    }}
                    disabled={selectedSeats.length === 0}
                    className={`w-[165px] h-[46px] text-white font-semibold rounded-full text-lg transition
                        ${selectedSeats.length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-[#FF5524] hover:bg-[#FF5524]"}`}
                >
                    Buy Tickets
                </button>
            </div>
        </div>
    );
};

export default Booking;
