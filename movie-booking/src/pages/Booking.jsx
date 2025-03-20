import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import movieData from "../data/movies.json";
import { CloseCircleOutlined } from "@ant-design/icons";
import SeatSelection from "../components/SeatSelection";

const Booking = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const movie = movieData.movies.find(m => m.id === Number(movieId));
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedDate, setSelectedDate] = useState("18");
    const [selectedTime, setSelectedTime] = useState("14:30");
    const dates = ["17 Sun", "18 Mon", "19 Tue", "20 Wed", "21 Thu", "22 Fri"];
    const times = ["10:30", "12:30", "14:30", "15:30", "16:30"];
    if (!movie) {
        return <div className="text-white text-center mt-10">Movie not found!</div>;
    }

    return (
        <div className="bg-black min-h-screen text-white relative flex flex-col items-center">
            <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-b to-black"></div>
                <img
                    src={movie.background}
                    alt={movie.title}
                    className="w-full h-[210px] object-cover"
                />
            </div>
            <button
                onClick={() => navigate(-1)}
                className="absolute top-7 left-12 w-[34px] h-[34px] bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
            >
                <CloseCircleOutlined className="text-xl" />
            </button>

            <h1 className="text-center text-gray-500 ">Screen this side</h1>

            <div className="mt-6 flex justify-center w-full">
                <div className="max-w-lg w-full">
                    <SeatSelection />
                </div>
            </div>

            <div className="flex items-center justify-around w-full max-w-md mt-4 text-sm">
                <div className="flex items-center gap-1">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <div className="absolute w-6 h-6 border-2 border-white rounded-full opacity-50"></div>
                        <div className="w-4 h-4 border border-white rounded-full bg-white"></div>
                    </div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <div className="absolute w-6 h-6 border-2 border-gray-600 rounded-full opacity-50"></div>
                        <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                    </div>
                    <span>Taken</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        <div className="absolute w-6 h-6 border-2 border-orange-500 rounded-full opacity-50"></div>
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    </div>
                    <span>Selected</span>
                </div>
            </div>

            <div className="flex gap-2 mt-6">
                {dates.map((date, index) => (
                    <button
                        key={index}
                        className={`w-14 h-20 rounded-full flex flex-col items-center justify-center text-md ${date.includes(selectedDate) ? "bg-orange-500" : "bg-black"
                            }`}
                        onClick={() => setSelectedDate(date.split(" ")[0])}
                    >
                        {date.split(" ")[0]}
                        <span className="text-xs">{date.split(" ")[1]}</span>
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto whitespace-nowrap no-scrollbar max-w-[90%] flex gap-2 mt-4">
                {times.map((time, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 rounded-full text-sm shrink-0 ${time === selectedTime ? "bg-orange-500" : "bg-black border border-white"
                            }`}
                        onClick={() => setSelectedTime(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className="p-6 mt-6 flex justify-around items-center w-full max-w-md">
                <div className="flex flex-col items-center text-center">
                    <p className="text-gray-400 text-lg">Total Price</p>
                    <p className="text-white text-xl font-semibold">$15.00</p>
                </div>

                <button className="bg-orange-500 w-[165px] h-[46px] text-white font-semibold rounded-full text-lg hover:bg-orange-600 transition">
                    Buy Tickets
                </button>
            </div>
        </div>
    );
};

export default Booking;
