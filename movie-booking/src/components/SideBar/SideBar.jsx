import React, { useEffect } from "react";
import { DollarOutlined, VideoCameraOutlined, ClockCircleOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons"; // Import icon từ Ant Design
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const Sidebar = ({ activeSection, setActiveSection }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    let userRole = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        } catch (err) {
            console.error("Lỗi khi giải mã token:", err);
        }
    }
    useEffect(() => {
        if (userRole === "Staff" && activeSection !== "movies") {
        }
    }, [userRole, activeSection, setActiveSection]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.reload();
        navigate("/");
    };
    return (
        <div
            className="w-64 bg-black text-white flex flex-col left-0 min-h-screen"
            style={{ position: "fixed" }}
        >
            <h2 className="text-2xl font-bold p-4 border-b border-gray-700 text-center">
                Dashboard
            </h2>
            <nav className="flex-1">
                <ul className="space-y-2 p-4">
                    {userRole === "Admin" && (
                        <li
                            className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 
                                ${activeSection === "revenue"
                                    ? "bg-orange text-black"
                                    : "hover:bg-gray-700"
                                }`}
                            onClick={() => setActiveSection("revenue")}
                        >
                            <DollarOutlined />
                            <span>Doanh thu</span>
                        </li>
                    )}
                    <li
                        className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 ${activeSection === "movies"
                            ? "bg-orange text-black"
                            : "hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveSection("movies")}
                    >
                        <VideoCameraOutlined />
                        <span>Quản lý phim</span>
                    </li>
                    <li
                        className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 ${activeSection === "showtimes"
                            ? "bg-orange text-black"
                            : "hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveSection("showtimes")}
                    >
                        <ClockCircleOutlined />
                        <span>Quản lý suất chiếu</span>
                    </li>
                    {userRole === "Admin" && (

                        <li
                            className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 ${activeSection === "employees"
                                ? "bg-orange text-black"
                                : "hover:bg-gray-700"
                                }`}
                            onClick={() => setActiveSection("employees")}
                        >
                            <UserOutlined />
                            <span>Quản lý nhân viên</span>
                        </li>
                    )}

                </ul>
            </nav>
            <div className="p-4 border-t border-gray-700 items-center flex justify-center gap-2">
                <button
                    className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 ${activeSection === "logout"
                        ? "bg-orange text-black"
                        : "hover:bg-gray-700"
                        }`}
                    onClick={handleLogout}
                >
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;