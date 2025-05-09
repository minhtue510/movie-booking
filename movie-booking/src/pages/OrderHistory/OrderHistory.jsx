import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import { Skeleton, Pagination } from "antd";
import { useTranslation } from "react-i18next";
import { fetchHistory } from "../../redux/store/historySlice";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tickets, loading, fetched } = useSelector((state) => state.history);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!fetched) {
      dispatch(fetchHistory());
    }
  }, [dispatch, fetched]);

  const handlePageChange = (page) => setCurrentPage(page);

  const paginatedTickets = (tickets || []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <div className="bg-black min-h-screen text-white px-4 sm:px-6 md:px-10 pb-16">
        <h1 className="text-xl pt-10 pb-10 text-center ">
          {t("ticket.history")}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-6 justify-center">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton.Button
                key={index}
                active
                style={{
                  width: "100%",
                  height: "0",
                  paddingTop: "150%",
                  borderRadius: "0.5rem",
                  backgroundColor: "#333",
                }}
              />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <p>{t("ticket.empty")}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-6 justify-center">
              {paginatedTickets.map((ticket) => (
                <div
                  key={`${ticket.orderId}-${ticket.movieId}`}
                  className="cursor-pointer"
                  onClick={() => navigate(`/history/${ticket.movieId}`)}
                >
                  <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow-md">
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-center mt-2 font-bold">{ticket.title}</p>
                </div>
              ))}
            </div>

            <div className="hidden sm:flex justify-center p-8">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={tickets.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </>
        )}

      </div>
      <BottomNav />
    </>
  );
};

export default OrderHistory;
