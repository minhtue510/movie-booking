import React, { useState } from "react";
import { UserOutlined, MailOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
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
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleSignUp = async () => {
        setEmailError("");
        setUsernameError("");
        setPasswordError("");
        setConfirmPasswordError("");

        let isValid = true;

        if (!email) {
            setEmailError("Vui lòng nhập email.");
            isValid = false;
        }

        if (!username) {
            setUsernameError("Vui lòng nhập tên đăng nhập.");
            isValid = false;
        }

        if (!password) {
            setPasswordError("Vui lòng nhập mật khẩu.");
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Vui lòng nhập lại mật khẩu.");
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Mật khẩu xác nhận không khớp.");
            isValid = false;
        }

        if (!isValid) return;

        try {
            await AuthUser.register(email, username, password, confirmPassword);
            navigate("/login");
        } catch (err) {
            console.error("Đăng ký thất bại:", err);
            setEmailError(err?.message || "Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    return (
        <>
            <Header />
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-[15%]">
                <img
                    src={background}
                    alt="Background"
                    className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
            </div>

            <div className="w-full max-w-xs text-center relative">
                <h1 className="text-3xl font-semibold">{t("register.title")}</h1>
                <p className="text-gray-400 text-sm mt-1">{t("register.subTitle")}</p>

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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setUsername(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                <button
                    onClick={handleSignUp}
                    className="mt-6 w-full py-2 bg-gradient-to-r from-[#4D1C09] to-[#FFD980] rounded-xl text-lg font-semibold cursor-pointer"
                >
                    {t("signUp")}
                </button>
                <div className="my-4 text-[#A4A4A4] flex items-center justify-center text-sm">
                    <span className="w-1/4 border-t border-white"></span>
                    <span className="mx-3 ">{t("register.another")}</span>
                    <span className="w-1/4 border-t border-white"></span>
                </div>

                <div className="btn-container">
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

                <div className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                    onClick={() => navigate("/login")}
                >
                    {t("register.guest")}<span className="font-semibold text-white"> {t("signIn")}</span>
                </div>
            </div>
        </div>
        </>
    );
};

export default SignUp;
