import React from "react";
import { FaHome, FaSearch, FaTicketAlt, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black py-3 z-50 flex justify-around text-white">
      {[
        { path: "/", icon: <FaHome />, label: "Home" },
        { path: "/search", icon: <FaSearch />, label: "Search" },
        { path: "/tickets", icon: <FaTicketAlt />, label: "Tickets" },
        { path: "/user", icon: <FaUser />, label: "User" }
        
      ].map(({ path, icon, label }) => (
        <button key={path} onClick={() => navigate(path)} className="relative">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              location.pathname === path ? "bg-orange-500 text-white" : "text-gray-400"
            }`}
          >
            {icon}
          </div>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
