import React, { useState, useEffect } from "react";
import { UserOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import logoutIcon from "../../assets/icon/logout.png";
import avatar from "../../assets/images/avatar.png";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav/BottomNav";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserFromToken } from "../../redux/store/authSlice";
import { jwtDecode } from "jwt-decode";
import Header from "../../components/Header/Header";
import { useTranslation } from "react-i18next";

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [decodedToken, setDecodedToken] = useState(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        dispatch(fetchUserFromToken());
        const token = localStorage.getItem("accessToken");

        if (token) {
            try {
                const decoded = jwtDecode(token);
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
        <>
            <Header />
            <div className="bg-black min-h-screen text-white pb-16 relative flex flex-col items-center sm:px-4 md:px-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl pt-10 pb-10">{t("profile.title")}</h1>

                <div className="w-24 h-24 rounded-full overflow-hidden sm:w-32 sm:h-32 md:w-40 md:h-40">
                    <img src={avatar} alt="User Profile" className="w-full h-full object-cover" />
                </div>

                <p className="mt-8 text-lg sm:text-xl md:text-2xl">{user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User Name"}</p>

                <div className="mt-8 w-full max-w-sm space-y-2 sm:max-w-md md:max-w-lg">
                    <MenuItem icon={<UserOutlined />} title={t("profile.account")} subtitle={`${t("profile.edit")}\n${t("profile.changePassword")}`} />
                    <MenuItem icon={<SettingOutlined />} title={t("settings")} subtitle={`${t("profile.theme")}\n${t("profile.permissions")}`} />
                    <MenuItem icon={<InfoCircleOutlined />} title={t("about")}subtitle={`${t("profile.about")}\n${t("profile.more")}`} />
                    <MenuItemLogout icon={<img src={logoutIcon} alt="Logout" className="w-5 h-5" />} title={t("logout.label")} onClick={showModal} />
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-[#5A5959]/40 flex items-center justify-center" onClick={handleCancel}>
                        <div className="bg-black text-white rounded-lg w-[90%] max-w-[400px] text-center pt-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto">?</div>
                            <p className="mt-4 text-lg font-semibold">{t("logout.confirmMessage")}</p>
                            <div className="w-full mt-6 border-t border-gray-500 flex">
                                <button onClick={handleCancel} className="flex-1 py-3 text-[#FF5524] font-semibold border-r border-gray-500">{t("logout.cancel")}</button>
                                <button onClick={handleOk} className="flex-1 py-3 text-[#FF5524] font-semibold">{t("logout.ok")}</button>
                            </div>
                        </div>
                    </div>
                )}

                <BottomNav />
            </div>
        </>
    );
};

const MenuItem = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-4 px-4 py-4 hover:bg-gray-800 cursor-pointer transition">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
            <p className="text-white font-semibold sm:text-lg">{title}</p>
            <p className="text-gray-400 text-sm whitespace-pre-line leading-tight sm:text-base">{subtitle}</p>
        </div>
        <span className="text-white text-4xl self-center h-15">›</span>
    </div>
);

const MenuItemLogout = ({ icon, title, onClick }) => (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer transition" onClick={onClick}>
        <div className="text-2xl">{icon}</div>
        <p className="text-[#FF5524] font-semibold flex-1 sm:text-lg">{title}</p>
        <span className="text-[#FF5524] text-4xl">
            ›
        </span>
    </div>
);

export default Profile;
