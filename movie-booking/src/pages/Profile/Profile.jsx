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
    const [expandedMenu, setExpandedMenu] = useState([]);
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
        localStorage.removeItem("refreshToken");
        setIsModalOpen(false);
        navigate("/");
        window.location.reload();

    };

    const handleCancel = () => setIsModalOpen(false);

    return (
        <div className="bg-black min-h-screen text-white pb-16 relative flex flex-col items-center sm:px-4 md:px-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl pt-10 pb-10">{t("profile.title")}</h1>

            <div>
                <img
                    src={user?.["AvatarUrl"] || avatar} // Sử dụng hình ảnh mặc định nếu AvatarUrl không hợp lệ
                    alt="User Profile"
                    className="w-24 h-24 border-orange border-2 rounded-full overflow-hidden sm:w-32 sm:h-32 md:w-40 md:h-40"
                />
            </div>

            <p className="mt-8 text-lg sm:text-xl md:text-2xl">{user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User Name"}</p>

            <div className="mt-8 w-full max-w-sm space-y-2 sm:max-w-md md:max-w-lg">
                <MenuItem
                    icon={<UserOutlined />}
                    title={t("profile.account")}
                    subtitle={`${t("profile.edit")}\n${t("profile.changePassword")}`}
                    index={0}
                    expandedMenu={expandedMenu}
                    setExpandedMenu={setExpandedMenu}
                    navigate={navigate}
                />
                <MenuItem
                    icon={<SettingOutlined />}
                    title={t("settings")}
                    subtitle={`${t("profile.theme")}\n${t("profile.permissions")}`}
                    index={1}
                    expandedMenu={expandedMenu}
                    setExpandedMenu={setExpandedMenu}
                />
                <MenuItem
                    icon={<InfoCircleOutlined />}
                    title={t("about")}
                    subtitle={`${t("profile.about")}\n${t("profile.more")}`}
                    index={2}
                    expandedMenu={expandedMenu}
                    setExpandedMenu={setExpandedMenu}
                />
                <MenuItemLogout
                    icon={<img src={logoutIcon} alt="Logout" className="w-5 h-5 " />}
                    title={t("logout.label")}
                    onClick={showModal}
                />
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
    );
};

const MenuItem = ({ icon, title, subtitle, index, expandedMenu, setExpandedMenu, navigate }) => {
    const isExpanded = expandedMenu.includes(index);
    const { t } = useTranslation();

    const toggleMenu = () => {
        if (isExpanded) {
            setExpandedMenu(expandedMenu.filter((i) => i !== index));
        } else {
            setExpandedMenu([...expandedMenu, index]);
        }
    };

    return (
        <div
            className={`flex flex-col px-4 py-3 rounded-lg transition-all duration-300 ${isExpanded ? "bg-white-15" : "hover:bg-[#2E2E2E]"
                } cursor-pointer`}
            onClick={toggleMenu}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-2xl text-white">{icon}</div>
                    <p className="text-white font-semibold sm:text-lg">{title}</p>
                </div>
                <span
                    className={`text-white text-xl transform transition-transform duration-300 ${isExpanded ? "rotate-90" : ""
                        }`}
                >
                    <span className="text-4xl">
                        ›
                    </span>
                </span>
            </div>
            {isExpanded && (
                <p className="text-gray-400 text-sm mt-2 whitespace-pre-line leading-tight sm:text-base">
                    {subtitle.split("\n").map((line, idx) => (
                        <span
                            key={idx}
                            className={`block p-2 cursor-pointer ${line === t("profile.edit") || line === t("profile.changePassword")
                                    ? "text-gray-400 hover:underline"
                                    : ""
                                }`}
                            onClick={() => {
                                if (line === t("profile.edit")) {
                                    navigate("/profile/edit");
                                } else if (line === t("profile.changePassword")) {
                                    navigate("/profile/changePassword");
                                }
                            }}
                        >
                            {line}
                        </span>
                    ))}
                </p>
            )}
        </div>
    );
};

const MenuItemLogout = ({ icon, title, onClick }) => (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-orange-900 rounded-lg cursor-pointer transition" onClick={onClick}>
        <div className="text-2xl">{icon}</div>
        <p className="text-[#FF5524] font-semibold flex-1 sm:text-lg">{title}</p>
        <span className="text-[#FF5524] text-4xl">
            ›
        </span>
    </div>
);

export default Profile;
