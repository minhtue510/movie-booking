import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get("success"); 
    const orderId = searchParams.get("orderId");
    const movieId = searchParams.get("movieId");
    const background = searchParams.get("background");

    if (success === "true" && orderId) {
      navigate(`/tickets/ticket/${orderId}`);
    } else {
      console.warn("Thanh toán thất bại hoặc bị hủy.");
      if (movieId) {
        navigate(`/booking/${movieId}`);
      } else {
        navigate("/"); 
      }
    }
  }, [searchParams, navigate]);

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold">Đang xử lý thanh toán...</h1>
    </div>
  );
};

export default PaymentCallback;
