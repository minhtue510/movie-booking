import React, { useEffect, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import barcodeImage from "../assets/images/barcode.jpg";
const Tickets = () => {
  const [tickets, setTickets] = useState([]);

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

  return (
    <div className="bg-black h-screen flex flex-col items-center p-4 text-white relative overflow-hidden">
      <h1 className="text-xl font-bold p-6">My Ticket</h1>
      {tickets.length === 0 ? (
        <p className="text-gray-400">No ticket booked yet.</p>
      ) : (
        <div className="flex-1 flex flex-col items-center  w-full">
          <div className="bg-orange-500 rounded-3xl w-[80%] max-w-[350px] h-[85vh] max-h-[80vh] flex flex-col items-center relative shadow-2xl">
            <div className="relative w-full h-[60%] rounded-t-3xl overflow-hidden shadow-lg">
              <img src={tickets[0].movie.background} alt={tickets[0].movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500"></div>
            </div>
            <div className="w-full bg-orange-500 text-center py-6 border-t-6 border-dashed border-black relative ">
              <div className="absolute -left-8 top-[-40px] w-18 h-18 bg-black rounded-full"></div>
              <div className="absolute -right-8 top-[-40px] w-18 h-18 bg-black rounded-full"></div>
              <div className="flex justify-center space-x-10 items-center w-full px-6 mt-2">
                <div className="flex flex-col items-center text-white gap-2">
                  <p className="font-bold text-4xl leading-none">{tickets[0].selectedDate.split(" ")[0]}</p>
                  <p className="text-lg">{tickets[0].selectedDate.split(" ")[1]}</p>
                </div>
                <div className="flex flex-col items-center text-white gap-2">
                  <ClockCircleOutlined className="text-4xl leading-none" />
                  <p className="text-lg">{tickets[0].selectedTime}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-around w-full px-8 text-sm">
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold">Hall</p>
                <p className="text-center">{tickets[0].hall}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold">Row</p>
                <p className="text-center">{getRowAndSeat(tickets[0].selectedSeats).row}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-white font-semibold">Seats</p>
                <p className="text-center">{getRowAndSeat(tickets[0].selectedSeats).seatNumbers}</p>
              </div>
            </div>

            <div className="w-60 h-15 mt-6 shadow-lg rounded-lg flex items-center justify-center">
              <img src={barcodeImage} alt="Barcode" className=" w-50 h-15" />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
