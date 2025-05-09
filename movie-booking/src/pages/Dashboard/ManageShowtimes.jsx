import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { getShowtimes } from "../../services/getShowtimes";
import dayjs from "dayjs";

const ManageShowtimes = () => {
    const [groupedShowtimes, setGroupedShowtimes] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await getShowtimes();
                const data = response?.data || [];

                const grouped = data.reduce((acc, showtime) => {
                    const room = showtime.roomName;
                    if (!acc[room]) acc[room] = [];

                    acc[room].push(showtime);
                    return acc;
                }, {});

                for (let room in grouped) {
                    grouped[room].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
                }

                setGroupedShowtimes(grouped);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách lịch chiếu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShowtimes();
    }, []);

    const columns = [
        {
            title: "Ngày chiếu",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "startTime",
            key: "startTime",
            render: (time) => dayjs(time, "HH:mm:ss").format("HH:mm"),
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "endTime",
            key: "endTime",
            render: (time) => dayjs(time, "HH:mm:ss").format("HH:mm"),
        },

        {
            title: "Tên phim",
            dataIndex: "movieName",
            key: "movieName",
            render: (text) => <span className="font-medium text-blue-700">{text}</span>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => {
                let color = "";
                let text = "";
                switch (status) {
                    case "UPCOMING":
                        color = "orange";
                        text = "Sắp chiếu";
                        break;
                    case "PLAYING":
                        color = "green";
                        text = "Đang chiếu";
                        break;
                    case "END":
                        color = "red";
                        text = "Đã chiếu";
                        break;
                    default:
                        color = "default";
                        text = "Không xác định";
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
    ];

    return (
        <div className="p-6 bg-white rounded-xl shadow-md w-full">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Quản lý lịch chiếu</h1>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                Object.keys(groupedShowtimes).map((roomName) => (
                    <div key={roomName} className="mb-10">
                        <h2 className="text-xl font-semibold mb-2 text-indigo-700">Phòng chiếu: {roomName}</h2>
                        <Table
                            columns={columns}
                            dataSource={groupedShowtimes[roomName]}
                            rowKey="id"
                            pagination={false}
                            bordered
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default ManageShowtimes;
