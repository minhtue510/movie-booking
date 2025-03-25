import React, { useState } from "react";
import { UserOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import background from "../../assets/images/background.png";
import passwordIcon from "../../assets/icon/password.png";
import googleBtn from "../../assets/images/google.png";
import appleBtn from "../../assets/images/apple.png";
import facebookBtn from "../../assets/images/facebook.png";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
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

            <div className="w-full max-w-xs text-center relative z-10 mt-[50%]">
                <h1 className="text-3xl font-semibold">Welcome Back!</h1>
                <p className="text-gray-400 text-sm mt-1">welcome back we missed you</p>

                <div className="mt-6 text-left">
                    <label className="block text-sm font-semibold">Username</label>
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
                </div>

                <div className="text-right text-sm text-gray-400 mt-2 cursor-pointer hover:text-gray-300">
                    Forgot Password?
                </div>

                <button className="mt-6 w-full py-2 bg-gradient-to-r from-[#4D1C09] to-[#FFD980] rounded-xl text-lg font-semibold cursor-pointer"
                    onClick={() => navigate("/home")}
                >
                    Sign in
                </button>

                <div className="my-4 text-gray-400 flex items-center justify-center text-sm">
                    <span className="w-1/4 border-t border-white"></span>
                    <span className="mx-3">Or continue with</span>
                    <span className="w-1/4 border-t border-white"></span>
                </div>

                <div className="flex justify-center space-x-4 ">
                    <button className=" p-3 rounded-lg">
                        <img
                            src={googleBtn}
                        />
                    </button>
                    <button className="p-3 rounded-lg">
                        <img
                            src={appleBtn}
                        />
                    </button>
                    <button className=" p-3 rounded-lg">
                        <img
                            src={facebookBtn}
                        />
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
