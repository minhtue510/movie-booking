import React, { useEffect, useState } from 'react';
import { getSeats, checkSeat } from '../services/getSeats';
import availableSeat from "../assets/icon/available.svg";
import selectedSeat from "../assets/icon/selected.svg";
import takenSeat from "../assets/icon/taken.svg";
import doubleSeatAvailable from "../assets/icon/doubleSeatAvailable.svg";
import doubleSeatSelected from "../assets/icon/doubleSeatSelected.svg";
import doubleSeatTaken from "../assets/icon/doubleSeatTaken.svg";

const SeatSelection = ({ showtime }) => {
    const [seats, setSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]); // Dữ liệu ghế đã đặt

    useEffect(() => {
        if (!showtime) return;

        const fetchSeats = async () => {
            try {
                // Lấy danh sách ghế từ API
                const seatData = await getSeats(showtime);
                
                // Kiểm tra ghế đã đặt
                const booked = await checkSeat(showtime); // Lọc các ghế đã đặt theo showtimeId
                console.log("Ghế đã đặt: ", booked); // Kiểm tra danh sách ghế đã đặt

                setBookedSeats(booked); // Lưu lại ghế đã đặt

                // Cập nhật trạng thái các ghế dựa trên thông tin đã đặt
                const updatedSeats = seatData.map(seat => {
                    const isBooked = booked.includes(seat.seatId); // Kiểm tra ghế đã đặt
                    console.log(`Seat ${seat.seatId} isBooked: ${isBooked}`);
                    return {
                        ...seat,
                        isBooked
                    };
                });

                setSeats(updatedSeats); // Cập nhật lại danh sách ghế
            } catch (error) {
                console.error("Lỗi khi lấy danh sách ghế:", error);
            }
        };

        fetchSeats();
    }, [showtime]);

    const singleSeats = seats.filter(seat => seat.type === 'Ghế thường');
    const doubleSeats = seats.filter(seat => seat.type === 'Ghế đôi');
    const vipSeats = seats.filter(seat => seat.type === 'Ghế VIP');

    return (
        <div className="flex flex-col items-center">
            <div className="text-center text-[#4D4D4D] mb-4 rounded-lg">Screen this side</div>

            {/* Ghế VIP */}
            <div className="grid grid-cols-10 gap-2">
                {vipSeats.map((seat) => (
                    <div
                        key={seat.seatId}
                        className={`flex items-center justify-center rounded-md 
                            ${seat.isBooked ? 'bg-gray-400' : ''} w-8 h-8`}
                    >
                        <img src={seat.isBooked ? doubleSeatTaken : doubleSeatAvailable} alt="Ghế VIP" className="w-6 h-6" />
                    </div>
                ))}
            </div>

            {/* Ghế thường */}
            <div className="grid grid-cols-10 gap-2">
                {singleSeats.map((seat) => (
                    <div
                        key={seat.seatId}
                        className={`flex items-center justify-center rounded-md 
                            ${seat.isBooked} w-8 h-8`}
                    >
                        <img
                            src={seat.isBooked ? takenSeat : availableSeat} // Nếu ghế đã đặt, hiển thị icon selectedSeat
                            alt="Ghế thường"
                            className="w-6 h-6"
                        />
                    </div>
                ))}
            </div>

            {/* Ghế đôi */}
            <div className="grid grid-cols-6 gap-10 mb-4">
                {doubleSeats.map((seat) => (
                    <div
                        key={seat.seatId}
                        className={`flex items-center justify-around rounded-md 
                            ${seat.isBooked ? 'bg-gray-400' : ''} w-25 h-10`}
                    >
                        <img src={seat.isBooked ? doubleSeatTaken : doubleSeatAvailable} alt="Ghế đôi" className="w-12 h-8" />
                    </div>
                ))}
            </div>
            

            {/* Text trạng thái */}
            <div>
                <>Available</> {/* Đã có ghế trống */}
                <>Taken</> {/* Đã đặt ghế */}
                <>Selected</> {/* Ghế được chọn */}
            </div>
        </div>
    );
};

export default SeatSelection;
