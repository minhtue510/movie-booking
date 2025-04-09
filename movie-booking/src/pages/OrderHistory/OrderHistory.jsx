import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav.jsx";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserFromToken } from "../../redux/store/authSlice.js";
import { jwtDecode } from "jwt-decode";
import { getHistory } from "../../services/getHistory.js";

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [decodedToken, setDecodedToken] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserFromToken());
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setDecodedToken(decoded);
          const { data } = await getHistory(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
          console.log("Lịch sử đặt vé:", decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]); // Debugging line
          setTickets(data || []);        
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu lịch sử:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="bg-black min-h-screen text-white pb-16 relative flex flex-col items-center">
            <h1 className="text-xl pt-10 pb-2">Ticket History</h1>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : tickets.length === 0 ? (
          <p>Không có vé nào.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={`${ticket.orderId}-${ticket.movieId}`} 
              className="cursor-pointer"
              onClick={() => navigate(`/history/${ticket.movieId}`)}
            >
              <img
                src={ticket.image}
                alt={ticket.title}
                className="w-[166px] h-[250px] object-cover rounded-lg shadow-md"
              />
              <p className="text-sm text-center mt-2 font-bold">{ticket.title}</p>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default OrderHistory;
