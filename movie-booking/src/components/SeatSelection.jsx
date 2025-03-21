import React, { useState } from "react";
import availableSeat from "../assets/icon/available.svg"; 
import selectedSeat from "../assets/icon/selected.svg"; 
import takenSeat from "../assets/icon/taken.svg"; 

const seats = [
  ["A1", "A2", "A3"],
  ["B1", "B2", "B3", "B4", "B5"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
  ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"],
  ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"],
  ["G1", "G2", "G3", "G4", "G5", "G6", "G7"],
  ["H1", "H2", "H3", "H4", "H5", "H6", "H7"],
  ["I1", "I2", "I3", "I4", "I5"],
  ["J1", "J2", "J3"]
];

const seatsTaken = new Set([
  "A1",
  "B4",
  "C5", "C6",
  "D4", "D7",
  "E3", "E4", "E7", "E8",
  "F4", "F7",
  "G5", "G6",
  "H1", "H4", "H7",
  "I4",
  "J1"
]);

const SeatSelection = ({ onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (!seat || seatsTaken.has(seat)) return;
  
    setSelectedSeats((prev) => {
      const newSeats = prev.includes(seat) 
        ? prev.filter((s) => s !== seat) 
        : [...prev, seat];
  
      if (onSeatSelect) {
        setTimeout(() => onSeatSelect(newSeats), 0);
      }
  
      return newSeats;
    });
  };
  

  return (
    <div>
      {seats.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((seat, seatIndex) => {
            const isSelected = selectedSeats.includes(seat);

            return (
              <button
                key={seatIndex}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-md transition-transform ${
                  isSelected ? "scale-110" : "hover:scale-105"
                }`}
                onClick={() => toggleSeat(seat)}
              >
                <img
                  src={seatsTaken.has(seat) ? takenSeat : isSelected ? selectedSeat : availableSeat}
                  alt="seat"
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SeatSelection;
