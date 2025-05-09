import { CloseCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../services/editUser';
import { jwtDecode } from "jwt-decode";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "../../pages/ChangePassword/ChangePassword.css"
const ChangePassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    if (token) {
        const decoded = jwtDecode(token);
        const userId =
            decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ];
    }
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setErrorMessage("");
    };
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!formData.currentPassword) {
            setErrorMessage("Vui lòng nhập mật khẩu hiện tại.");
            return;
        }
        if (!formData.newPassword) {
            setErrorMessage("Vui lòng nhập mật khẩu mới.");
            return;
        }
        if (formData.newPassword === formData.currentPassword) {
            setErrorMessage("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.newPassword)) {
            setErrorMessage(
                "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt."
            );
            return;
        }
        if (!formData.confirmPassword) {
            setErrorMessage("Vui lòng xác nhận mật khẩu mới.");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }


        setErrorMessage("");
        setIsLoading(true);

        try {
            const token = localStorage.getItem("accessToken");
            const decoded = jwtDecode(token);
            const userId =
                decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ];

            const response = await changePassword(
                userId,
                formData.currentPassword,
                formData.newPassword,
                formData.confirmPassword
            );

            setSuccessMessage("Đổi mật khẩu thành công.");
            setTimeout(() => {
                setSuccessMessage("");
                navigate("/profile");
            }, 3000);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Mật khẩu hiện tại không đúng.");
            } else {
                setErrorMessage("Đổi mật khẩu thất bại. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="relative bg-black min-h-screen text-white flex flex-col items-center px-4 pt-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl pb-10">{t("password.reset")}</h1>
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 w-10 h-10 bg-orange text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition block md:hidden"
            >
                <CloseCircleOutlined className="text-2xl" />
            </button>
            <div className="w-full max-w-md space-y-5">
                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">{t("password.currentPassword")}</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder={t("password.enterCurrentPassword")}
                            className="w-full bg-transparent outline-none"
                            required
                        />
                         <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">{t("password.newPassword")}</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder={t("password.enterNewPassword")}
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
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">{t("password.confirmPassword")}</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={t("password.enterConfirmPassword")}
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
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}

                {successMessage && (
                    <p className="text-green-500 text-sm mt-2 items-center">{successMessage}</p>
                )}
                <button
                    onClick={handleChangePassword}
                    type="submit"
                    className="w-full bg-orange text-white p-3 rounded-md font-semibold hover:bg-[#FF5524] transition cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? t("password.isChanging") : t("password.reset")}
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;