import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css"; 

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="notfound-container ">
      <h1>404</h1>
      <p>Trang bạn tìm không tồn tại.</p>
      <span>Đang quay lại trang chủ...</span>
    </div>
  );
};

export default NotFound;
