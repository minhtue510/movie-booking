import React, { useState, useEffect } from "react";

const AlertSuccess = ({ message = "Thao tác thành công!", duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hiển thị thông báo khi component được mount
    setVisible(true);

    // Ẩn thông báo sau `duration` (mặc định 3 giây)
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    // Dọn dẹp timer khi component bị unmount
    return () => clearTimeout(timer);
  }, [message, duration]);

  return (
    <div
      role="alert"
      className={`transition-all duration-500 ease-in-out transform ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        } flex items-center gap-4 border border-green-500 text-green-500 bg-green-50 p-4 rounded-md `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <strong>Thành công</strong>
        <p className="text-sm font-medium"> {message}</p>
      </div>
    </div>
  );
};

export default AlertSuccess;