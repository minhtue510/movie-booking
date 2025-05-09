import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getOrderDetail } from "../../services/getOrderDetail";
import dayjs from "dayjs";
import Header from "../../components/Header/Header";
import { useTranslation } from "react-i18next";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);  
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (orderId) {
      getOrderDetail(orderId)
        .then((res) => {
          if (res?.data?.length > 0) {
            const formattedTickets = res.data.map((ticket) => ({
              background: ticket.imageMovie,
              title: ticket.title || "My Movie",
              selectedDate: ticket.showTimeDate,
              selectedTime: ticket.showTimeStart,
              hall: ticket.hall,
              row: ticket.seatRow,
              seat: ticket.seatNumber,
              orderId: ticket.orderId,
            }));

            setTickets(formattedTickets);
            localStorage.setItem("tickets", JSON.stringify(formattedTickets));
          } else {
            console.warn("Không có dữ liệu ticket từ API.");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi gọi API getOrderDetail:", err);
        })
        .finally(() => {
          setIsLoading(false); 
        });
    } else {
      const storedTickets = JSON.parse(localStorage.getItem("tickets")) || [];
      setTickets(storedTickets);
      setIsLoading(false);
    }
  }, [location.search, orderId]);

  return (
    <>
      <div className="bg-black h-screen flex flex-col items-center p-4 text-white relative overflow-hidden">
        <h1 className="text-xl font-bold pb-4">{t("myTickets")}</h1>
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-12 w-[34px] h-[34px] bg-[#FF5524] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition block md:hidden"
        >
          <CloseCircleOutlined className="text-xl" />
        </button>

        <div className="flex-1 flex flex-col items-center w-full overflow-y-auto h-full">
          {isLoading ? (
            <div className="bg-[#333] animate-pulse rounded-3xl w-[85%] max-w-[350px] h-[90%] flex flex-col items-center relative shadow-2xl pb-4 mt-4">
            </div>
          ) : tickets.length === 0 ? (
            <p className="text-gray-400">{t("ticket.empty")}</p>
          ) : (
            tickets.map((ticket, index) => {
              const formattedDate = dayjs(ticket.selectedDate).format("ddd, D , MMMM , YYYY");
              const formattedTime = dayjs(ticket.selectedTime, "HH:mm").format("HH:mm");

              return (
                <div
                  key={index}
                  className="bg-[#FF5524] rounded-3xl w-[85%] max-w-[350px] h-[90%] flex flex-col items-center relative shadow-2xl pb-4 mt-4"
                >
                  <div className="relative w-full h-[80%] rounded-t-3xl overflow-hidden shadow-lg">
                    <img
                      src={ticket.background}
                      alt={ticket.title}
                      className="w-full h-full object-fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FF5524]"></div>
                  </div>
                  <div className="w-full h-[10vh] bg-[#FF5524] text-center py-4 border-t-2 border-dashed border-black relative">
                    <div className="absolute -left-8 top-[-35px] w-16 h-16 bg-black rounded-full"></div>
                    <div className="absolute -right-8 top-[-35px] w-16 h-16 bg-black rounded-full"></div>
                    <div className="flex items-center gap-10 w-full justify-center">
                      <div className="flex flex-col items-center text-white gap-2">
                        <p className="font-bold text-xl leading-none">
                          {formattedDate.split(",")[1]}
                        </p>
                        {/* <p className="text-sm">{formattedDate.split(",")[0]}</p> */}
                        <p className="text-sm">{t(`days.${formattedDate.split(",")[0].toLowerCase()}`)}</p>
                        
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
                      <p className="text-center text-sm">{ticket.row}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-white font-semibold text-xl">{t("ticket.seat")}</p>
                      <p className="text-center text-sm">{ticket.seat}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <QRCodeCanvas
                      value={JSON.stringify({
                        orderId: ticket.orderId,
                        seat: ticket.seat,
                        row: ticket.row,
                        time: ticket.selectedTime,
                        date: ticket.selectedDate,
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

export default Tickets;
