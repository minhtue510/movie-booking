// import React, { useState } from "react";
// import { ClockCircleOutlined } from "@ant-design/icons";
// import { QRCodeCanvas } from "qrcode.react";

// const TicketCard = ({ ticket, onUpdateTicket }) => {
//   const isUsed = ticket?.used || false; 

//   const handleScanQRCode = () => {
//     if (!isUsed) {
//       onUpdateTicket(ticket.id); 
//     }
//   };

//   return (
//     <div className="bg-orange-500 rounded-3xl w-[85%] max-w-[350px] flex flex-col items-center relative shadow-2xl pb-4">
//       <div className="relative w-full h-[80%] rounded-t-3xl overflow-hidden shadow-lg">
//         <img
//           src={ticket.movie.background}
//           alt={ticket.movie.title}
//           className="w-full h-full object-cover"
//         />
//         <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${isUsed ? "bg-gray-500 text-white" : "bg-green-500 text-black"}`}>
//           {isUsed ? "Đã sử dụng" : "Chưa sử dụng"}
//         </div>
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500"></div>
//       </div>

//       <div className="w-full h-[10vh] bg-orange-500 text-center py-4 border-t-6 border-dashed border-black relative">
//         <div className="absolute -left-8 top-[-30px] w-16 h-16 bg-black rounded-full"></div>
//         <div className="absolute -right-8 top-[-30px] w-16 h-16 bg-black rounded-full"></div>
//         <div className="flex items-center gap-10 w-full justify-center mt-3">
//           <div className="flex flex-col items-center text-white gap-2">
//             <p className="font-bold text-3xl leading-none">{ticket.selectedDate.split(" ")[0]}</p>
//             <p className="text-sm">{ticket.selectedDate.split(" ")[1]}</p>
//           </div>
//           <div className="flex flex-col items-center text-white gap-2">
//             <ClockCircleOutlined className="text-3xl" />
//             <p className="text-sm">{ticket.selectedTime}</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-around w-full px-6 pb-4 text-xs mt-1">
//         <div className="flex flex-col items-center">
//           <p className="text-white font-semibold text-xl">Hall</p>
//           <p className="text-center text-sm">{ticket.hall}</p>
//         </div>
//         <div className="flex flex-col items-center">
//           <p className="text-white font-semibold text-xl">Row</p>
//           <p className="text-center text-sm">{ticket.selectedSeats.join(", ")}</p>
//         </div>
//       </div>

//       <div className="w-50 h-50 mt-2 shadow-lg rounded-lg flex items-center justify-center bg-white mb-4">
//         <QRCodeCanvas value={JSON.stringify(ticket)} size={220} />
//       </div>

//       {!isUsed && (
//         <button 
//           onClick={handleScanQRCode} 
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-3 shadow-md hover:bg-blue-600 transition"
//         >
//           Quét mã
//         </button>
//       )}
//     </div>
//   );
// };

// export default TicketCard;
