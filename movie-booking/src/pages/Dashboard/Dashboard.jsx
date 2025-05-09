import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Input, FloatButton, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getMovies } from "../../services/getMovies";
import Sidebar from "../../components/SideBar/SideBar";
import { Fullscreen } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Revenue from "../../pages/Dashboard/Revenue";
import ManageEmployees from "./ManageEmployees";
import ManageShowtimes from "./ManageShowtimes";
const { Search } = Input;
const Dashboard = () => {
    let userRole = null;
    const token = localStorage.getItem("accessToken");

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        } catch (err) {
            console.error("Lỗi khi giải mã token:", err);
        }
    }
    const [activeSection, setActiveSection] = useState(userRole === "Admin" ? "revenue" : "movies");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const data = await getMovies(searchTerm);
            setMovies(data.sort((a, b) => {
                if (a.status === "playing" && b.status !== "playing") return -1;
                if (a.status !== "playing" && b.status === "playing") return 1;
                return a.title.localeCompare(b.title, "vi", { sensitivity: "base" });
            }));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeSection === "movies") {
            fetchMovies();
        }
    }, [activeSection]);

    useEffect(() => {
        fetchMovies(searchTerm);
    }, [searchTerm]);

    const columns = [
        {
            title: "Poster",
            dataIndex: "image",
            key: "image",
            width: 50,
            render: (image) => (
                <img
                    src={image}
                    alt="Movie Poster"
                    className="w-30 h-30 object-fill rounded"
                />
            ),
        },
        {
            title: "Tên phim",
            dataIndex: "title",
            key: "title",
            width: 100,
            ellipsis: true,
        },

        {
            title: "Thể loại",
            dataIndex: "genres",
            key: "genres",
            render: (genres) => (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {genres.map((genre, index) => (
                        <Tag color="blue" key={index}>
                            {genre}
                        </Tag>
                    ))}
                </div>
            ),
            width: 100,

        },
        {
            title: "Quốc gia",
            dataIndex: "nation",
            key: "nation",
            width: 50,
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            width: 50,
            align: "center",
            sorter: (a, b) => {
                if (a.status === b.status) {
                    return a.rating - b.rating;
                }
                return 0;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 50,
            render: (status) => {
                let color = "";
                let text = "";
                switch (status) {
                    case "upcoming":
                        color = "orange";
                        text = "Sắp chiếu";
                        break;
                    case "playing":
                        color = "green";
                        text = "Đang chiếu";
                        break;
                }
                return <Tag color={color}>{text}</Tag>;
            },
            align: "center",
        },
        {
            title: "Hành động",
            key: "action",
            width: 30,
            render: (_, record) => (
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <EditOutlined
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() => handleEditMovie(record.id)}
                    />
                    <DeleteOutlined
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDeleteMovie(record.id)}
                    />
                </div>
            ),
        },
    ];

    const handleEditMovie = (movieId) => {
        navigate(`/dashboard/edit-movies?id=${movieId}`);
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <div className="flex-1 p-6 ml-64">
                {activeSection === "revenue" && (
                    <Revenue />
                )}
                {activeSection === "movies" && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Quản lý phim</h1>
                        <Button
                            type="primary"
                            className="mb-4"
                            onClick={() => navigate("/dashboard/add-movies")}
                        >
                            Thêm phim
                        </Button>

                        <Search
                            placeholder="Tìm kiếm phim..."
                            allowClear
                            enterButton="Tìm kiếm"
                            size="large"
                            onSearch={(value) => setSearchTerm(value)}
                            className="mb-4"
                        />
                        <Table
                            columns={columns}
                            dataSource={movies}
                            loading={loading}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: false,
                            }}

                        />
                    </div>
                )}
                {activeSection === "showtimes" && (
                    <div>
                      <ManageShowtimes/>
                    </div>
                )}
                  {activeSection === "employees" && (
                  <ManageEmployees/>
                )}
            </div>
            <FloatButton.BackTop
                style={{
                    right: 20,
                    bottom: 35,
                    backgroundColor: "#1088e9",
                    color: "#fff",
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
            />
        </div>
    );
};

export default Dashboard;