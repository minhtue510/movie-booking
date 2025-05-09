import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUser, updateInfo } from "../../services/editUser";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { uploadImage } from "../../services/editUser"
const EditProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [formData, setFormData] = useState({
        avatarUrl: "",
        userName: "",
        fullName: "",
        email: "",
        phoneNumber: "",
    });
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decoded = jwtDecode(token);
            const userId =
                decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ];
            if (userId) {
                getUser(userId).then((data) => {
                    setUserInfo(data);
                    setFormData({
                        avatarUrl: data.avatarUrl || "",
                        userName: data.userName || "",
                        fullName: data.fullName || "",
                        email: data.email || "",
                        phoneNumber: data.phoneNumber || "",
                    });
                });
            }
        }
    }, []);

    const handleChange = (e) => {
        
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = async () => {
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            setErrorMessage("Số điện thoại phải bao gồm đúng 10 số.");
            return;
        }
        setErrorMessage("");
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        const decoded = jwtDecode(token);
        const userId =
            decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ];
        try {
            const updatedData = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                avatarUrl: formData.avatarUrl,
            };

            const response = await updateInfo(userId, updatedData);
            
            setSuccessMessage(t("edit.success"));
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (error) {
            setErrorMessage("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    //   if (!userInfo) return <div className="text-white">Đang tải...</div>;

    return (
        <div className="relative bg-black min-h-screen text-white flex flex-col items-center px-4 pt-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl pb-10">{t("profile.edit")}</h1>
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 w-10 h-10 bg-orange text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FF5524] transition block md:hidden"
            >
                <CloseCircleOutlined className="text-2xl" />
            </button>
            <div className="relative">
                <img
                    src={formData.avatarUrl || "https:via.placeholder.com/150"}
                    alt="Avatar"
                    className="w-24 h-24 border-orange border-2 rounded-full overflow-hidden sm:w-32 sm:h-32 md:w-40 md:h-40"

                >
                </img>
                <button
                    className="absolute bottom-1 right-1 bg-white text-black rounded-full w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 shadow-md transition hover:scale-105"
                    onClick={() => document.getElementById("avatarUpload").click()}
                >
                    <FontAwesomeIcon icon={faPen} className="text-sm sm:text-lg md:text-xl cursor-pointer" />
                </button>
            </div>
            <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        try {
                            const response = await uploadImage(file);
                            setFormData((prev) => ({
                                ...prev,
                                avatarUrl: response.avatarUrl,
                            }));
                        } catch (error) {
                            console.error("Lỗi khi tải ảnh lên:", error.response || error.message);
                            alert("Không thể tải ảnh lên. Vui lòng thử lại.");
                        }
                    }
                }}
            />

            <div className="w-full max-w-md space-y-5 mt-8">

                <div className="relative">
                    <label className="absolute -top-3 left-3  px-1 text-sm text-gray-400">{t("profile.userName")}</label>
                    <div className="flex items-center bg-white-15  text-white p-3 rounded-md">
                        <UserOutlined className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            className="w-full bg-transparent outline-none"
                            readOnly
                        />
                    </div>
                </div>
                <div className="relative">
                    <label className="absolute -top-3 left-3  px-1 text-sm text-gray-400">{t("edit.fullName")}</label>
                    <div className="flex items-center bg-white-15  text-white p-3 rounded-md">
                        <UserOutlined className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-transparent outline-none"
                            placeholder={t("edit.enterFullName")}
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">Email</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <MailOutlined className="text-gray-400 mr-3" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            className="w-full bg-transparent outline-none"
                            readOnly
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className="absolute -top-3 left-3 px-1 text-sm text-gray-400">{t("edit.phone")}</label>
                    <div className="flex items-center bg-white-15 text-white p-3 rounded-md">
                        <PhoneOutlined className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                const phoneNumber = e.target.value;
                                if (/^\d{0,10}$/.test(phoneNumber)) {
                                    handleChange(e);
                                    setErrorMessage("");
                                }
                            }}
                            className="w-full bg-transparent outline-none"
                            placeholder={t("edit.enterPhone")}

                        />
                    </div>

                    {formData.phoneNumber.length >= 3 &&
                        !/^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)/.test(
                            formData.phoneNumber
                        ) && (
                            <p className="text-red-500 text-sm mt-1">
                                Vui lòng nhập số điện thoại hợp lệ.
                            </p>
                        )}

                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-3">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm mt-4 text-center">{successMessage}</p>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    className={`w-full bg-orange text-white p-3 rounded-md font-semibold hover:bg-[#FF5524] transition cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={isLoading} 
                    >
                    {isLoading ? t("edit.isSaving") : t("edit.save")}
                </button>

            </div>
        </div>
    );
};

export default EditProfile;
