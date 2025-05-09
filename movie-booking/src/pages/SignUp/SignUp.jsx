import React, { useState, useEffect } from "react";
import { UserOutlined, MailOutlined, EyeInvisibleOutlined, EyeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "../../services/AuthUser";
import background from "../../assets/images/background.png";
import passwordIcon from "../../assets/icon/password.png";
import googleBtn from "../../assets/icon/google.png";
import appleBtn from "../../assets/icon/apple.png";
import facebookBtn from "../../assets/icon/facebook.png";
import "../../pages/SignUp/SignUp.css";
import Header from "../../components/Header/Header";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "../../components/ChangeLanguage/ChangeLanguage";
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [verificationStatus, setVerificationStatus] = useState(null); // Trạng thái xác thực email
    const [verificationMessage, setVerificationMessage] = useState("");

    useEffect(() => {
        // Lấy trạng thái xác thực từ URL hoặc state
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get("status");
        const message = queryParams.get("message");

        if (status) {
            setVerificationStatus(status);
            setVerificationMessage(decodeURIComponent(message || ""));

        }
    }, [location]);

    const handleSignUp = async () => {
        setEmailError("");
        setUsernameError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setGeneralError("");
        let hasError = false;
        if (!email) {
            setEmailError("Vui lòng nhập email.");
            hasError = true;
        }

        if (!username) {
            setUsernameError("Vui lòng nhập tên đăng nhập.");
            hasError = true;
        }

        if (!password) {
            setPasswordError("Vui lòng nhập mật khẩu.");
            hasError = true;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Vui lòng xác nhận lại mật khẩu.");
            hasError = true;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Mật khẩu xác nhận không khớp.");
            hasError = true;
        }

        if (hasError) return;


        try {
            await AuthUser.register(email, username, password, confirmPassword);
            setVerificationStatus("success");
            setVerificationMessage("Tạo tài khoản thành công. Vui lòng kiểm tra email để xác nhận tài khoản!");
            setTimeout(() => {
                setVerificationMessage("");
                setVerificationStatus(null);
            }, 5000);
        } catch (err) {
            if (err.email) setEmailError(err.email);
            if (err.username) setUsernameError(err.username);
            if (err.password) setPasswordError(err.password);
            if (err.confirmPassword) setConfirmPasswordError(err.confirmPassword);
            if (!err.email && !err.username && !err.password && !err.confirmPassword) {
                setGeneralError(err.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!");
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative"
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleSignUp();
                }
            }}>
            <div className="absolute top-0 left-0 w-full">
                <img
                    src={background}
                    alt="Background"
                    className="w-full h-full object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black lg:bg-transparent"></div>
            </div>

            <div className="absolute top-4 right-4 sm:hidden md:hidden block z-10 ">
                <ChangeLanguage />
            </div>

            <div className="relative z-10 w-full 
    max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
    text-center rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 
    mt-[40%] sm:mt-[30%] md:mt-[20%] lg:mt-[10%] xl:mt-[5%] 
    mb-10 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 
    shadow-2xl bg-black/50 backdrop-blur-md"
            >
                <h1 className="text-3xl font-semibold">{t("register.title")}</h1>
                <p className="text-gray-400 text-sm mt-1">{t("register.subTitle")}</p>

                {verificationStatus && (
                    <div
                        className={`mt-4 p-4 rounded-lg ${verificationStatus === "success" ? "bg-green-500" : "bg-red-500"
                            } text-white`}
                    >
                        {verificationMessage}
                    </div>
                )}

                <div className="mt-6 text-left">
                    <label className="block text-sm font-semibold text-[#A4A4A4]">{t("register.email")}</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MailOutlined />
                        </span>
                        <input
                            type="email"
                            placeholder={t("register.email")}
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border border-white/50 rounded-lg focus:outline-none shadow-md"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError("");
                                if (generalError) setGeneralError("");

                            }}
                        />
                    </div>
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>

                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold text-[#A4A4A4]">{t("register.name")}</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <UserOutlined />
                        </span>
                        <input
                            type="text"
                            placeholder={t("register.name")}
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border border-white/50 rounded-lg focus:outline-none shadow-md"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (usernameError) setUsernameError("");
                                if (generalError) setGeneralError(""); // Xóa lỗi khi người dùng nhập
                            }}
                        />
                    </div>
                    {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                </div>

                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold text-[#A4A4A4]" >{t("register.password")}</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <img src={passwordIcon} alt="password" className="w-4 h-4" />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("register.password")}
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] border border-white/50 text-gray-300 rounded-lg focus:outline-none"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordError) setPasswordError(""); // Xóa lỗi khi người dùng nhập
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
                </div>

                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold text-[#A4A4A4]">{t("register.confirmPassword")}</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <img src={passwordIcon} alt="password" className="w-4 h-4" />
                        </span>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("register.confirmPassword")}
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] border border-white/50 text-gray-300 rounded-lg focus:outline-none"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmPasswordError) setConfirmPasswordError("");
                            }}
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                </div>
                {generalError && <p className="text-red-500 text-sm mt-5">{generalError}</p>}
                <button
                    onClick={handleSignUp}

                    className="mt-6 w-full py-2 bg-gradient-to-r from-[#4D1C09] to-[#FFD980] rounded-xl text-lg font-semibold cursor-pointer"
                >
                    {t("signUp")}
                </button>
                <div className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-gray-300 relative z-20 !text-lg"
                    onClick={() => navigate("/login")}
                >
                    {t("register.guest")}<span className="font-semibold text-white"> {t("signIn")}</span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
