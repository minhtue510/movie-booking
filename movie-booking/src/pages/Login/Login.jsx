import React, { useState } from "react";
import { UserOutlined, EyeInvisibleOutlined, EyeOutlined, CaretDownOutlined } from "@ant-design/icons";
import background from "../../assets/images/background.png";
import passwordIcon from "../../assets/icon/password.png";
import googleBtn from "../../assets/icon/google.png";
import appleBtn from "../../assets/icon/apple.png";
import facebookBtn from "../../assets/icon/facebook.png";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthUser } from "../../services/AuthUser";
import "../../pages/Login/Login.css";
import Header from "../../components/Header/Header";
import { useTranslation } from "react-i18next";
import vnFlag from "../../assets/icon/vietnam.svg";
import enFlag from "../../assets/icon/eng.png";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { from, selectedSeats, selectedTime, movieId } = location.state || {};
    const { t, i18n } = useTranslation();


    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const userData = await AuthUser.login(username, password);
            if (userData && userData.jwtToken) {
                const now = new Date().getTime();
                const expiryTime = now + 45 * 60 * 1000;
                localStorage.setItem("accessToken", userData.jwtToken);
                localStorage.setItem("tokenExpiry", expiryTime);

                if (from) {
                    console.log("Thông tin điều hướng:");
                    console.log("from:", from);
                    console.log("selectedSeats:", selectedSeats);
                    console.log("selectedTime:", selectedTime);
                    console.log("movieId:", movieId);

                    navigate(from, {
                        state: { selectedSeats, selectedTime, movieId },
                        replace: true,
                    });
                } else {
                    navigate("/home", { replace: true });
                }
            } else {
                setError("Không nhận được dữ liệu người dùng từ server");
            }
        } catch (err) {
            setError(err.message || "Sai thông tin đăng nhập");
        } finally {
            setLoading(false);
        }
    };

    const currentLang = i18n.language;
    const toggleLang = currentLang === "vi" ? "en" : "vi";
    const langAssets = {
        vi: {
            label: "VIE",
            icon: vnFlag,
        },
        en: {
            label: "ENG",
            icon: enFlag,
        },
    };
    const handleLangChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    return (
        <>
            <Header />

            <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative px-4">

                <div className="absolute top-0 left-0 w-full h-[30%] md:h-[30%] lg:h-[30%]">
                    <img
                        src={background}
                        alt="Background"
                        className="w-full h-full object-bottom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
                </div>
                <div className="absolute top-4 right-4 sm:hidden block z-10">
                    <div
                        className="px-3 py-1 rounded-full bg-[#1f1f1f] text-white text-sm cursor-pointer flex items-center gap-2"
                        onClick={() => handleLangChange(toggleLang)}
                    >
                        <img
                            src={langAssets[currentLang].icon}
                            alt={currentLang}
                            className="w-5 h-5"
                        />
                        <span>{langAssets[currentLang].label}</span>
                    </div>
                </div>

                <div className="relative z-10 w-full 
    max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
    text-center rounded-xl p-4 sm:p-6 md:p-8 
    mt-[40%] sm:mt-[30%] md:mt-[20%] lg:mt-[10%] 
    mb-10 sm:mb-12 md:mb-16 lg:mb-20 
    shadow-2xl "
                >
                    <h1 className="text-3xl font-semibold">{t("login.title")}</h1>
                    <p className="text-gray-400 text-sm mt-1">{t("login.subTitle")}</p>


                    <div className="mt-6 text-left">
                        <label className="block text-sm font-semibold text-[#A4A4A4]">{t("login.userName")}</label>
                        <div className="relative mt-1">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <UserOutlined />
                            </span>
                            <input
                                type="text"
                                placeholder={t("login.userName")}
                                className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border border-white/50 rounded-lg focus:outline-none shadow-md shadow-[#00000080]"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="mt-4 text-left">
                        <label className="block text-sm font-semibold text-[#A4A4A4]">{t("login.password")}</label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <img src={passwordIcon} alt="password" className="w-4 h-4" />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t("login.password")}
                                className="w-full py-3 pl-12 pr-4 bg-[#181818] border border-white/50 text-gray-300 rounded-lg focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </span>
                        </div>
                    </div>


                    {error && <p className="text-[#FF5524] text-sm mt-5">{error}</p>}


                    <button
                        className="mt-6 w-full py-2 bg-gradient-to-r from-[#4D1C09] to-[#FFD980] rounded-xl text-lg font-semibold cursor-pointer disabled:opacity-50"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? t("login.logging") : t("signIn")}
                    </button>


                    <div className="my-4 text-gray-400 flex items-center justify-center text-sm">
                        <span className="w-1/4 border-t border-white"></span>
                        <span className="mx-3">{t("login.another")}</span>
                        <span className="w-1/4 border-t border-white"></span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button className="btn-social">
                            <img src={googleBtn} alt="Google" />
                        </button>
                        <button className="btn-social">
                            <img src={appleBtn} alt="Apple" />
                        </button>
                        <button className="btn-social w-8 h-8">
                            <img src={facebookBtn} alt="Facebook" />
                        </button>
                    </div>

                    <div className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-gray-300 relative z-20 !text-lg" onClick={() => navigate("/signup")}>
                        {t("login.guest")}
                        <span className="font-semibold text-gray-200"> {t("signUp")}</span>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Login;