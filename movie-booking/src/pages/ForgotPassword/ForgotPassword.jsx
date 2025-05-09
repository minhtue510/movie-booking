import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "../../services/AuthUser";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
    
        if (!email) {
            setErrorMessage("Vui lòng nhập email.");
            return;
        }
    
        setIsLoading(true);
        try {
            const response = await AuthUser.forgotPassword(email);
            setSuccessMessage(response.message || "Yêu cầu đặt lại mật khẩu đã được gửi.");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            if (error.response?.status === 400) {
                throw { message: "Email không tồn tại. Vui lòng kiểm tra lại." };
            } else if (error.response?.status) {
                throw { message: `Lỗi từ máy chủ: ${error.response.status}` };
            } else {
                throw { message: "Có lỗi xảy ra. Vui lòng thử lại." };
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-black min-h-screen text-white flex flex-col items-center px-4 pt-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl pb-10">Quên mật khẩu</h1>
            <div className="w-full max-w-md space-y-5">
                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">Email</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="w-full bg-transparent outline-none"
                            required
                        />
                    </div>
                </div>

                {/* Hiển thị thông báo lỗi */}
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}

                {/* Hiển thị thông báo thành công */}
                {successMessage && (
                    <p className="text-green-500 text-sm mt-2">{successMessage}</p>
                )}

                <button
                    onClick={handleForgotPassword}
                    type="submit"
                    className={`w-full bg-orange text-white p-3 rounded-md font-semibold hover:bg-[#FF5524] transition cursor-pointer ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;