import React, { useState } from "react";
import availableSeat from "../assets/icon/available.jpg"; 
import selectedSeat from "../assets/icon/selected.jpg"; 
import takenSeat from "../assets/icon/taken.jpg"; 

const seats = [
  ["A1", "A2", "A3"],
  ["B1", "B2", "B3", "B4", "B5"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
  ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9"],
  ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"],
  ["G1", "G2", "G3", "G4", "G5", "G6", "G7"],
  ["H1", "H2", "H3", "H4", "H5"],
  ["I1", "I2", "I3", "I4", "I5"],
  ["J1", "J2", "J3"]
];

const seatsTaken = new Set([
   "D5", "D6", "D7",
  "E3", "E4", "E6", "E7", "E8", "E9",
  "F3", "F4", "F6", "F7", "F8", "F9",
  "G5", "G6", "G7",
  "H1", "H2", "H4", "H5",
  "I1", "I2",
  ]);

  const isSeatTaken = (seat) => seatsTaken.has(seat);

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (!seat || isSeatTaken(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div>
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
                  } ${seat === "" ? "opacity-0 cursor-default" : ""}`}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat && (
                    <img
                      src={isSeatTaken(seat) ? takenSeat : isSelected ? selectedSeat : availableSeat}
                      alt="seat"
                      className="w-full h-full object-contain"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatSelection;
