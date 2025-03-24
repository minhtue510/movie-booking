import React, { useEffect, useState } from "react";
import { ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    setTickets(storedTickets);
    console.log("Tickets Data:", storedTickets);
  }, []);

  const getRowAndSeat = (seats) => {
    if (!seats || seats.length === 0) return { row: "", seatNumbers: "" };
    const sortedSeats = seats.sort((a, b) => {
      const rowA = a[0];
      const rowB = b[0];
      const seatNumberA = parseInt(a.slice(1));
      const seatNumberB = parseInt(b.slice(1));

      if (rowA === rowB) {
        return seatNumberA - seatNumberB;
      }
      return rowA.localeCompare(rowB);
    });

    const seatRows = sortedSeats.map((seat) => seat[0]);
    const seatNumbers = sortedSeats.map((seat) => seat.slice(1));

    return {
      row: [...new Set(seatRows)].join(", "),
      seatNumbers: seatNumbers.join(", "),
    };
  };

  const generateQRCodeData = (ticket) => {
    return JSON.stringify({
      movie: ticket.movie.title,
      date: ticket.selectedDate,
      time: ticket.selectedTime,
      hall: ticket.hall,
      row: getRowAndSeat(ticket.selectedSeats).row,
      seats: getRowAndSeat(ticket.selectedSeats).seatNumbers,
    });
  };

  return (
    <div className="bg-black h-screen flex flex-col items-center p-4 text-white relative overflow-hidden">
      <h1 className="text-xl font-bold pb-4">My Ticket</h1>
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-12 w-[34px] h-[34px] bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
      >
        <CloseCircleOutlined className="text-xl" />
      </button>
      {tickets.length === 0 ? (
        <p className="text-gray-400">No ticket booked yet.</p>
      ) : (
        <div className="flex-1 flex flex-col items-center w-full">
          <div className="bg-orange-500 rounded-3xl w-[85%] max-w-[350px] h-[95%] flex flex-col items-center relative shadow-2xl pb-4">
            <div className="relative w-full h-[80%] rounded-t-3xl overflow-hidden shadow-lg">
              <img
                src={tickets[0].movie.background}
                alt={tickets[0].movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500"></div>
            </div>
            <div className="w-full h-[10vh] bg-orange-500 text-center py-4 border-t-6 border-dashed border-black relative">
              <div className="absolute -left-8 top-[-30px] w-16 h-16 bg-black rounded-full"></div>
              <div className="absolute -right-8 top-[-30px] w-16 h-16 bg-black rounded-full"></div>
              <div className="flex items-center gap-10 w-full justify-center mt-3">
                <div className="flex flex-col items-center text-white gap-2">
                  <p className="font-bold text-3xl leading-none">{tickets[0].selectedDate.split(" ")[0]}</p>
                  <p className="text-sm">{tickets[0].selectedDate.split(" ")[1]}</p>
                </div>
                <div className="flex flex-col items-center text-white gap-2">
                  <ClockCircleOutlined className="text-3xl" />
                  <p className="text-sm">{tickets[0].selectedTime}</p>
                </div>
              </div>

            </div>
            <div className="flex justify-around w-full px-6 pb-4 text-xs mt-1">
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold text-xl">Hall</p>
                <p className="text-center text-sm">{tickets[0].hall}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold text-xl">Row</p>
                <p className="text-center text-sm">{getRowAndSeat(tickets[0].selectedSeats).row}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold text-xl">Seats</p>
                <p className="text-center text-sm">{getRowAndSeat(tickets[0].selectedSeats).seatNumbers}</p>
              </div>
            </div>
            <div className="w-50 h-50 mt-2 shadow-lg rounded-lg flex items-center justify-center bg-white mb-4">
              <QRCodeCanvas value={generateQRCodeData(tickets[0])} size={220} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
