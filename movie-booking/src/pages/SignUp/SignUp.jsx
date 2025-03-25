import React, { useState } from "react";
import { UserOutlined, MailOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate("/login"); // Điều hướng sau khi đăng ký thành công
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
            {/* Background Image */}
            <div className="absolute top-0 left-0 w-full h-[30%]">
                <img
                    src={background}
                    alt="Background"
                    className="w-full h-full object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
            </div>

            {/* Sign Up Form */}
            <div className="w-full max-w-xs text-center relative z-10 mt-[50%]">
                <h1 className="text-3xl font-semibold">Get Started Free</h1>
                <p className="text-gray-400 text-sm mt-1">Free Forever. No Credit Card Needed</p>

                {/* Email Input */}
                <div className="mt-6 text-left">
                    <label className="block text-sm font-semibold">Email Address</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <MailOutlined />
                        </span>
                        <input
                            type="email"
                            placeholder="yourname@gmail.com"
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border border-white/50 rounded-lg focus:outline-none shadow-md shadow-[#00000080]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Username Input */}
                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold">Your Name</label>
                    <div className="relative mt-1">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <UserOutlined />
                        </span>
                        <input
                            type="text"
                            placeholder="@yourname"
                            className="w-full py-3 pl-12 pr-4 bg-[#181818] text-gray-300 border border-white/50 rounded-lg focus:outline-none shadow-md shadow-[#00000080]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="mt-4 text-left">
                    <label className="block text-sm font-semibold">Password</label>
                    <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <img src={passwordIcon} alt="password" className="w-4 h-4" />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
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

                {/* Sign Up Button */}
                <button
                    onClick={handleSignUp}
                    className="mt-6 w-full py-2 bg-gradient-to-r from-[#4D1C09] to-[#FFD980] rounded-xl text-lg font-semibold cursor-pointer"
                >
                    Sign up
                </button>

                {/* Or Sign Up With */}
                <div className="my-4 text-gray-400 flex items-center justify-center text-sm">
                    <span className="w-1/4 border-t border-white"></span>
                    <span className="mx-3">Or sign up with</span>
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
                    onClick={() => navigate("/login")}
                >
                    Already have an account? <span className="font-semibold text-white">Sign In</span>
                </div>

            </div>
        </div>
    );
};

export default SignUp;
