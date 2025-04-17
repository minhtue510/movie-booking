import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketDetail } from "../../services/getTicketDetail";
import { jwtDecode } from "jwt-decode";
import { QRCodeCanvas } from "qrcode.react";
import { ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header/Header";

const TicketDetail = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTicketDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Không tìm thấy token.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        if (!userId || !id) {
          console.error("Không tìm thấy userId hoặc movieId.");
          return;
        }

        const data = await getTicketDetail(userId, id);
        const sortedTickets = data.data.sort((a, b) => {
          const dateTimeA = new Date(`${a.showTimeDate}T${a.showTimeStart}`);
          const dateTimeB = new Date(`${b.showTimeDate}T${b.showTimeStart}`);
          return dateTimeB - dateTimeA;
        });

        setTickets(sortedTickets);


      } catch (error) {
        console.error("Lỗi khi lấy chi tiết vé:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetail();
  }, [id]);

  return (
    <>
      <Header />
      <div className="bg-black h-screen flex flex-col items-center p-4 text-white relative overflow-hidden block">
        <h1 className="text-xl font-bold pb-4">{t("myTickets")}</h1>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-12 w-[34px] h-[34px] bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition block md:hidden"
        >
          <CloseCircleOutlined className="text-xl" />
        </button>
  
        <div className="flex-1 flex flex-col items-center w-full overflow-y-auto h-full">
          {loading ? (
            <div className="bg-[#333] animate-pulse rounded-3xl w-[85%] max-w-[350px] h-[90%] flex flex-col items-center relative shadow-2xl pb-4 mt-4">
            </div>
          ) : (
            tickets.map((ticket, index) => {
              const formattedDate = dayjs(ticket.showTimeDate).format("ddd, D ,  MMMM , YYYY");
              const formattedTime = dayjs(ticket.showTimeStart, "HH:mm").format("HH:mm");
  
              return (
                <div
                  key={index}
                  className="bg-[#FF5524] rounded-3xl w-[85%] max-w-[350px] h-[90%] flex flex-col items-center relative shadow-2xl pb-4 mt-4"
                >
                  <div className="relative w-full h-[80%] rounded-t-3xl overflow-hidden shadow-lg">
                    <img
                      src={ticket.imageMovie}
                      alt={ticket.title}
                      className="w-full h-full object-fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FF5524]" />
                  </div>
                  <div className="w-full h-[10vh] bg-[#FF5524] text-center py-4 border-t-2 border-dashed border-black relative">
                    <div className="absolute -left-8 top-[-35px] w-16 h-16 bg-black rounded-full"></div>
                    <div className="absolute -right-8 top-[-35px] w-16 h-16 bg-black rounded-full"></div>
                    <div className="flex items-center gap-10 w-full justify-center">
                      <div className="flex flex-col items-center text-white gap-2">
                        <p className="font-bold text-xl leading-none">{formattedDate.split(",")[1]}</p>
                        <p className="text-sm">{formattedDate.split(",")[0]}</p>
                      </div>
                      <div className="flex flex-col items-center text-white gap-2">
                        <ClockCircleOutlined className="text-xl" />
                        <p className="text-sm">{formattedTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-around w-full px-6 pb-4 text-xs mt-1">
                    <div className="flex flex-col items-center">
                      <p className="text-white font-semibold text-xl">{t("ticket.hall")}</p>
                      <p className="text-center text-sm">{ticket.hall}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-white font-semibold text-xl">{t("ticket.row")}</p>
                      <p className="text-center text-sm">{ticket.seatRow}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-white font-semibold text-xl">{t("ticket.seat")}</p>
                      <p className="text-center text-sm">{ticket.seatNumber}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <QRCodeCanvas
                      value={JSON.stringify({
                        orderId: ticket.orderId,
                        seats: ticket.seatNumber,
                        row: ticket.seatRow,
                        time: ticket.showTimeStart,
                        date: ticket.showTimeDate,
                      })}
                      className="bg-white rounded-xl p-2"
                      size={200}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );  
};

export default TicketDetail;
