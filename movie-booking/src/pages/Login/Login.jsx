import React, { useState } from "react";
import { UserOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import background from "../../assets/images/background.png";
import passwordIcon from "../../assets/icon/password.png";
import googleBtn from "../../assets/icon/google.png";
import appleBtn from "../../assets/icon/apple.png";
import facebookBtn from "../../assets/icon/facebook.png";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "../../services/AuthUser";
import "../../pages/Login/Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        try {
            const userData = await AuthUser.login(username, password);
            console.log("Đăng nhập thành công:", userData);
            navigate("/home");
        } catch (err) {
            setError(err.message || "Sai thông tin đăng nhập");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
            <div className="absolute top-0 left-0 w-full h-[30%]">
                <img
                    src={background}
                    alt="Background"
                    className="w-full h-full object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
            </div>

            <div className="w-full max-w-xs text-center relative z-10 mt-[30%]">
                <h1 className="text-3xl font-semibold">Welcome Back!</h1>
                <p className="text-gray-400 text-sm mt-1">Welcome back, we missed you</p>

                <div className="mt-6 text-left">
                    <label className="block text-sm font-semibold text-[#A4A4A4]">Username</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <UserOutlined />
                        </span>
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border  border-white/50 rounded-lg focus:outline-none shadow-md shadow-[#00000080]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold text-[#A4A4A4]">Password</label>
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
                </div>

                {error && <p className="text-[#FF5524] text-sm mt-5 justify-center">{error}</p>}

                <button
                    className="mt-6 w-full py-2 bg-gradient-to-r from-[#4D1C09] to-[#FFD980] rounded-xl text-lg font-semibold cursor-pointer"
                    onClick={handleLogin}
                >
                    Sign in
                </button>

                <div className="my-4 text-gray-400 flex items-center justify-center text-sm">
                    <span className="w-1/4 border-t border-white"></span>
                    <span className="mx-3">Or continue with</span>
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


                <div
                    className="mt-6 text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                    onClick={() => navigate("/signup")}
                >
                    Don’t have an account? <span className="font-semibold text-gray-200">Sign Up</span>
                </div>
            </div>
        </div>
    );
};

export default Login;