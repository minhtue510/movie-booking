import React, { useEffect, useState } from 'react';
import { getSeats, checkSeat } from '../../services/getSeats';
import availableSeat from "../../assets/icon/available.svg";
import selectedSeat from "../../assets/icon/selected.svg";
import takenSeat from "../../assets/icon/taken.svg";
import doubleSeatAvailable from "../../assets/icon/doubleSeatAvailable.svg";
import doubleSeatSelected from "../../assets/icon/doubleSeatSelected.svg";
import doubleSeatTaken from "../../assets/icon/doubleSeatTaken.svg";
import { useTranslation } from "react-i18next";
const SeatSelection = ({ selectedSeats, setSelectedSeats, showtime }) => {
    const [seats, setSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const { t } = useTranslation();
    useEffect(() => {
        if (!showtime) return;
        setSelectedSeats([]);

        const fetchSeats = async () => {
            try {
                const seatData = await getSeats(showtime);
                const booked = await checkSeat(showtime);
                setBookedSeats(booked);
                const updatedSeats = seatData.map(seat => ({
                    ...seat,
                    isBooked: booked.includes(seat.seatId)
                }));
                setSeats(updatedSeats);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách ghế:", error);
            }
        };

        fetchSeats();
    }, [showtime]);

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return;

        setSelectedSeats((prevSelected) => {
            const isSelected = prevSelected.some(s => s.seatId === seat.seatId);
            if (isSelected) {
                return prevSelected.filter(s => s.seatId !== seat.seatId);
            } else {
                return [...prevSelected, seat];
            }
        });
    };
    const handleSelectSeat = (seat) => {
        setSelectedSeats((prev) => [...prev, seat]);
    };

    useEffect(() => {
        console.log("Ghế đã chọn trong SeatSelection:", selectedSeats);
    }, [selectedSeats]);

    return (
        <div className="flex flex-col items-center">
            <div className="text-center bg-[#595959] w-[260px] h-2 mb-5 rounded-lg"></div>

            <div className="flex flex-col items-center gap-2">
  {
    [...Array(Math.ceil(seats.filter(seat => seat.type === 'Ghế thường').length / 10))].map((_, rowIndex) => {
      const filteredSeats = seats.filter(seat => seat.type === 'Ghế thường');
      const rowSeats = filteredSeats.slice(rowIndex * 10, rowIndex * 10 + 10);
      return (
        <div key={rowIndex} className="flex justify-center">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${rowSeats.length}, minmax(0, 1fr))` }}
          >
            {rowSeats.map((seat) => (
              <div
                key={seat.seatId}
                onClick={() => handleSeatClick(seat)}
                className={`flex items-center justify-center rounded-md cursor-pointer 
                  ${seat.isBooked ? 'pointer-events-none opacity-50' : ''}
                  ${selectedSeats.some(s => s.seatId === seat.seatId) ? '' : ''} w-8 h-8`}
              >
                <img
                  src={seat.isBooked ? takenSeat :
                    selectedSeats.some(s => s.seatId === seat.seatId) ? selectedSeat : availableSeat}
                  alt="Ghế thường"
                  className="w-6 h-6"
                />
              </div>
            ))}
          </div>
        </div>
      );
    })
  }
</div>


            <div className="flex justify-center my-2">
                <div className="grid grid-cols-5 gap-2">
                    {seats.filter(seat => seat.type === 'Ghế đôi' && seat.seatId % 2 !== 0).map((seat) => (
                        <div
                            key={seat.seatId}
                            onClick={() => handleSeatClick(seat)}
                            className={`flex items-center justify-around rounded-md cursor-pointer
                    ${seat.isBooked ? 'pointer-events-none opacity-50' : ''}
                    ${selectedSeats.some(s => s.seatId === seat.seatId) ? '' : ''} w-15 h-10`}
                        >
                            <img
                                src={seat.isBooked ? doubleSeatTaken :
                                    selectedSeats.some(s => s.seatId === seat.seatId) ? doubleSeatSelected : doubleSeatAvailable}
                                alt="Ghế đôi"
                                className="w-12 h-8"
                            />
                        </div>
                    ))}
                </div>
            </div>


            <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                    <img src={availableSeat} className="w-6 h-6" alt="Available" />
                    <span>{t("seat.available")}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={takenSeat} className="w-6 h-6" alt="Taken" />
                    <span>{t("seat.taken")}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <img src={selectedSeat} className="w-6 h-6" alt="Selected" />
                    <span>{t("seat.selected")}</span>
                </div>
            </div>
        </div>

    );
};

export default SeatSelection;
