import React, { useState } from "react";
import { UserOutlined, MailOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "../../services/AuthUser";
import background from "../../assets/images/background.png";
import passwordIcon from "../../assets/icon/password.png";
import googleBtn from "../../assets/images/google.png";
import appleBtn from "../../assets/images/apple.png";
import facebookBtn from "../../assets/images/facebook.png";

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
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-[15%]">
                <img 
                src={background} 
                alt="Background" 
                className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
            </div>

            <div className="w-full max-w-xs text-center relative">
                <h1 className="text-3xl font-semibold">Get Started Free</h1>
                <p className="text-gray-400 text-sm mt-1">Free Forever. No Credit Card Needed</p>

                <div className="mt-6 text-left">
                    <label className="block text-sm font-semibold">Email Address</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MailOutlined />
                        </span>
                        <input
                            type="email"
                            placeholder="yourname@gmail.com"
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border border-white/50 rounded-lg focus:outline-none shadow-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>

                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold">Your Name</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <UserOutlined />
                        </span>
                        <input
                            type="text"
                            placeholder="@yourname"
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border border-white/50 rounded-lg focus:outline-none shadow-md"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                </div>



                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold">Password</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <img src={passwordIcon} alt="password" className="w-4 h-4" />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
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
                    <label className="block text-sm font-semibold">Confirm Password</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <img src={passwordIcon} alt="password" className="w-4 h-4" />
                        </span>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
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
                    Sign up
                </button>
                <div className="my-4 text-gray-400 flex items-center justify-center text-sm">
                    <span className="w-1/4 border-t border-white"></span>
                    <span className="mx-3">Or continue with</span>
                    <span className="w-1/4 border-t border-white"></span>
                </div>

                <div className="flex justify-center space-x-4 ">
                    <button className=" p-3 rounded-lg">
                        <img src={googleBtn} />
                    </button>
                    <button className="p-3 rounded-lg">
                        <img src={appleBtn} />
                    </button>
                    <button className=" p-3 rounded-lg">
                        <img src={facebookBtn} />
                    </button>
                </div>
                <div className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                    onClick={() => navigate("/login")}
                >
                    Already have an account? <span className="font-semibold text-white">Sign In</span>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
