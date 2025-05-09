import React, { useState } from "react";
import { Dropdown } from "antd";
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
import { jwtDecode } from "jwt-decode";
import ChangeLanguage from "../../components/ChangeLanguage/ChangeLanguage";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { from, selectedSeats, selectedTime, movieId } = location.state || {};
    const { t, i18n } = useTranslation();


    const handleLogin = async () => {
        setUsernameError("");
        setPasswordError("");
        setGeneralError("");
        setLoading(true);
        let hasError = false;
        if (!username) {
            setUsernameError("Tài khoản không được để trống");
            hasError = true;
        }
        if (!password) {
            setPasswordError("Mật khẩu không được để trống");
            hasError = true;
        }
        if (hasError) {
            setLoading(false);
            return;
        }
        try {
            const userData = await AuthUser.login(username, password);
            if (userData && userData.jwtToken) {
                localStorage.setItem("accessToken", userData.jwtToken);
                const decodedToken = jwtDecode(userData.jwtToken);
                const exp = decodedToken.exp;
                localStorage.setItem("tokenExpiry", exp);
                if (from) {
                    navigate(from, {
                        state: { selectedSeats, selectedTime, movieId },
                        replace: true,
                    });
                } else {
                    navigate("/", { replace: false });
                    window.location.reload();

                }
            } else {
                setGeneralError("Không nhận được dữ liệu người dùng từ server");
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                if (errors.username) setUsernameError(errors.username.join(", "));
                if (errors.password) setPasswordError(errors.password.join(", "));
            } else {
                setGeneralError(err.message || "Sai thông tin đăng nhập");
            }
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen w-full bg-black text-white flex items-center justify-center relative px-4"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleLogin();
                }
            }}>
            <div className="absolute top-0 left-0 w-full ">
                <img
                    src={background}
                    alt="Background"
                    className="w-full h-full object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black lg:bg-transparent"></div>
            </div>
            <div className="absolute top-4 right-4 sm:hidden block z-10">
                <ChangeLanguage />
            </div>




            <div className="relative z-10 w-full 
    max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
    text-center rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 
    mt-[40%] sm:mt-[30%] md:mt-[20%] lg:mt-[10%] xl:mt-[5%] 
    mb-10 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 
    shadow-2xl bg-black/50 backdrop-blur-md"
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
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (usernameError) setUsernameError(""); // Xóa lỗi username
                                if (generalError) setGeneralError(""); // Xóa lỗi chung
                            }}
                        />
                    </div>
                    {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
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
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordError) setPasswordError("");
                                if (generalError) setGeneralError("");
                            }}
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                    <div className="flex justify-end mt-2">
                        <div
                            className="text-gray cursor-pointer hover:text-gray-300"
                            onClick={() => navigate("/forgot-password")}
                        >
                            {t("login.forgotPassword")}
                        </div>
                    </div>
                </div>

                {generalError && <p className="text-red-500 text-sm mt-5">{generalError}</p>}

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
                    <button className="btn-social">
                        <img src={facebookBtn} alt="Facebook" />
                    </button>
                </div>

                <div className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-gray-300 relative z-20 !text-lg" onClick={() => navigate("/signup")}>
                    {t("login.guest")}
                    <span className="font-semibold text-gray-200"> {t("signUp")}</span>
                </div>
            </div>
        </div>

    );
};

export default Login;