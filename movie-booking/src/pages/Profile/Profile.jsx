import React, { useState, useEffect } from "react";
import { UserOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import logoutIcon from "../../assets/icon/logout.png";
import avatar from "../../assets/images/avatar.png";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserFromToken } from "../../redux/store/authSlice";
import { jwtDecode } from "jwt-decode";
const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [decodedToken, setDecodedToken] = useState(null);
    
    useEffect(() => {
        dispatch(fetchUserFromToken()); 
        const token = localStorage.getItem("accessToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Dữ liệu từ token:", decoded);
                setDecodedToken(decoded);
            } catch (error) {
                console.error("Lỗi giải mã token:", error);
            }
        }
    }, [dispatch]);

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExpiry");
        setIsModalOpen(false);
        navigate("/login");
    };
    
    const handleCancel = () => setIsModalOpen(false);

    return (
        <div className="bg-black min-h-screen text-white pb-16 relative flex flex-col items-center">
            <h1 className="text-xl pt-10 pb-10">My Profile</h1>
            <div className="w-24 h-24 rounded-full overflow-hidden">
                <img src={avatar} alt="User Profile" className="w-full h-full object-cover" />
            </div>

            <p className="mt-8 text-lg">{user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User Name"}</p>

            <div className="mt-8 w-full max-w-sm space-y-2">
                <MenuItem icon={<UserOutlined />} title="Account" subtitle={"Edit Profile\nChange Password"} />
                <MenuItem icon={<SettingOutlined />} title="Settings" subtitle={"Themes\nPermissions"} />
                <MenuItem icon={<InfoCircleOutlined />} title="About" subtitle={"About Movies\nMore"} />
                <MenuItemLogout icon={<img src={logoutIcon} alt="Logout" className="w-5 h-5" />} title="Logout" onClick={showModal} />
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#5A5959]/40 flex items-center justify-center" onClick={handleCancel}>
                    <div className="bg-black text-white rounded-lg w-[90%] max-w-[360px] text-center pt-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto">?</div>
                        <p className="mt-4 text-lg font-semibold">Are you sure you want to log out?</p>
                        <div className="w-full mt-6 border-t border-gray-500 flex">
                            <button onClick={handleCancel} className="flex-1 py-3 text-[#FF5524] font-semibold border-r border-gray-500">Cancel</button>
                            <button onClick={handleOk} className="flex-1 py-3 text-[#FF5524] font-semibold">OK</button>
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
};

const MenuItem = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-4 px-4 py-4 hover:bg-gray-800 cursor-pointer transition">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
            <p className="text-white font-semibold">{title}</p>
            <p className="text-gray-400 text-sm whitespace-pre-line leading-tight">{subtitle}</p>
        </div>
        <span className="text-white text-4xl self-center h-15">›</span>
    </div>
);

const MenuItemLogout = ({ icon, title, onClick }) => (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer transition" onClick={onClick}>
        <div className="text-2xl">{icon}</div>
        <p className="text-[#FF5524] font-semibold flex-1">{title}</p>
        <span className="text-[#FF5524] text-4xl">
            ›
        </span>
    </div>
);

export default Profile;
