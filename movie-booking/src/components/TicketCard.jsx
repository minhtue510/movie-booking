
import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";

const TicketCard = ({ ticket }) => {
  const formattedDate = new Date(ticket.dateTime).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
  });
  const formattedTime = new Date(ticket.dateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-[#FF5524] rounded-3xl w-[85%] max-w-[350px] flex flex-col items-center relative shadow-2xl pb-6 mt-6">

      <div className="relative w-full h-[260px] rounded-t-3xl overflow-hidden shadow-lg">
        <img
          src={ticket.imageMovie}
          alt={ticket.title}
          className="w-full h-full object-cover"
        />
      </div>

  
      <div className="absolute -left-4 top-[250px] w-8 h-8 bg-black rounded-full z-10"></div>
      <div className="absolute -right-4 top-[250px] w-8 h-8 bg-black rounded-full z-10"></div>

   
      <div className="text-white w-full text-center mt-6">
        <div className="flex justify-center items-center gap-12 mb-4">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold">{formattedDate.split(" ")[1]}</p>
            <p className="text-sm">{formattedDate.split(" ")[0]}</p>
          </div>
          <div className="flex flex-col items-center">
            <ClockCircleOutlined className="text-2xl" />
            <p className="text-sm">{formattedTime}</p>
          </div>
        </div>

        <div className="flex justify-around text-xs px-6 mb-6">
          <div>
            <p className="font-semibold text-lg">Hall</p>
            <p>{ticket.hall}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Row</p>
            <p>{ticket.seatRow}</p>
          </div>
          <div>
            <p className="font-semibold text-lg">Seats</p>
            <p>{Array.isArray(ticket.seatNumbers) ? ticket.seatNumbers.join(", ") : ticket.seatRow}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-2">
        <div
          className="bg-white p-4 rounded-xl shadow-lg w-[150px] h-[150px] flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: ticket.qrCode }}
        />
        <p className="text-white text-sm mt-2">Scan to verify</p>
      </div>
    </div>
  );
};

export default TicketCard;
