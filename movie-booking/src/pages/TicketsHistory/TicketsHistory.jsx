import React from "react";
import { useNavigate } from "react-router-dom";
import ticketsData from "../../data/tickets.json"; 
import BottomNav from "../../components/BottomNav";

const TicketHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen text-white px-8 pb-16">
      <h2 className="text-xl font-semibold pt-6">Ticket History</h2>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {ticketsData.tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="cursor-pointer"
            onClick={() => navigate(`/ticket/${ticket.id}`)}
          >
            <img
              src={ticket.image}
              alt={ticket.movieTitle}
              className="w-[166px] h-[250px] object-cover rounded-lg shadow-md"
            />
            <p className="text-sm text-center mt-2 font-bold">{ticket.movieTitle}</p>
          </div>
        ))}
      </div>
      <BottomNav/>
    </div>
  );
};

export default TicketHistory;



// import React, { useEffect, useState } from "react";
// import TicketCard from "../components/TicketCard"; // Import component

// const TicketHistory = () => {
//   const [usedTickets, setUsedTickets] = useState([]);

//   useEffect(() => {
//     const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
//     const filteredTickets = storedTickets.filter(ticket => ticket.used); // Chỉ lấy vé đã sử dụng
//     setUsedTickets(filteredTickets);
//   }, []);

//   return (
//     <div className="bg-black min-h-screen text-white px-8 pb-16">
//       <h2 className="text-xl font-semibold pt-6">Lịch sử vé</h2>

//       {usedTickets.length === 0 ? (
//         <p className="text-gray-400 mt-6">Chưa có vé đã sử dụng.</p>
//       ) : (
//         <div className="md:grid-cols-2 gap-4 mt-6">
//           {usedTickets.map((ticket) => (
//             <TicketCard key={ticket.id} ticket={ticket} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketHistory;