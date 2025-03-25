import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const foundTicket = storedTickets.find((t) => t.id === id);
    setTicket(foundTicket);
  }, [id]);

  if (!ticket) return <p>Vé không tồn tại</p>;

  return (
    <div className="ticket-detail">
      <h1>Vé của bạn</h1>
      <p>Phim: {ticket.movie.title}</p>
      <p>Ngày: {ticket.selectedDate}</p>
      <p>Giờ: {ticket.selectedTime}</p>
      <p>Phòng: {ticket.hall}</p>
    </div>
  );
};

export default TicketDetail;
