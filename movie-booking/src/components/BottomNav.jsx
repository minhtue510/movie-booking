import React, { useState } from "react";
import { FaHome, FaSearch, FaTicketAlt, FaUser } from "react-icons/fa";

const BottomNav = () => {
  const [active, setActive] = useState("home");

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black py-3 z-50 flex justify-around text-white">
      <button onClick={() => setActive("home")} className="relative">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            active === "home" ? "bg-orange-500" : ""
          }`}
        >
          <FaHome className={`text-xl ${active === "home" ? "text-white" : "text-gray-400"}`} />
        </div>
      </button>

      <button onClick={() => setActive("search")}>
        <FaSearch className={`text-xl ${active === "search" ? "text-white" : "text-gray-400"}`} />
      </button>

      <button onClick={() => setActive("ticket")}>
        <FaTicketAlt className={`text-xl ${active === "ticket" ? "text-white" : "text-gray-400"}`} />
      </button>

      <button onClick={() => setActive("user")}>
        <FaUser className={`text-xl ${active === "user" ? "text-white" : "text-gray-400"}`} />
      </button>
    </div>
  );
};

export default BottomNav;
