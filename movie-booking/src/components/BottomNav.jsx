import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "../assets/icon/home.jpg";
import searchIcon from "../assets/icon/search.jpg";
import ticketIcon from "../assets/icon/ticket.jpg";
import userIcon from "../assets/icon/user.jpg";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: homeIcon, label: "Home" },
    { path: "/search", icon: searchIcon, label: "Search" },
    { path: "/tickets", icon: ticketIcon, label: "Tickets" },
    { path: "/user", icon: userIcon, label: "User" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black py-3 z-50 flex justify-around text-white">
      {navItems.map(({ path, icon, label }) => (
        <button key={path} onClick={() => navigate(path)} className="relative">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              location.pathname === path ? "bg-orange-500 text-white" : "text-gray-400"
            }`}
          >
            <img src={icon} alt={label} className="w-6 h-6 object-contain" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
