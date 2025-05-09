import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthUser } from "../../services/AuthUser";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!newPassword) {
            setErrorMessage("Vui lòng nhập mật khẩu mới");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setErrorMessage(
                "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt."
            );
            return;
        }

        if (!confirmPassword) {
            setErrorMessage("Vui lòng nhập lại mật khẩu mới.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await AuthUser.resetPassword(email, token, newPassword);
            setSuccessMessage(response.message || "Đặt lại mật khẩu thành công.");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setErrorMessage(error.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-black min-h-screen text-white flex flex-col items-center px-4 pt-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl pb-10">Đặt lại mật khẩu</h1>
            <div className="w-full max-w-md space-y-5">
                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">Mật khẩu mới</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setErrorMessage("");
                            }}
                            placeholder="Nhập mật khẩu mới"
                            className="w-full bg-transparent outline-none"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                </div>

                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">Xác nhận mật khẩu</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrorMessage("");
                            }}
                            placeholder="Xác nhận mật khẩu mới"
                            className="w-full bg-transparent outline-none"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
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
                    onClick={handleResetPassword}
                    type="submit"
                    className={`w-full bg-orange text-white p-3 rounded-md font-semibold hover:bg-[#FF5524] transition cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;