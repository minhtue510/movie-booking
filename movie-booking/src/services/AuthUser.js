import axios from "axios";
import { BASE_URL } from "./config";
import {jwtDecode} from "jwt-decode";
import ResetPassword from "../components/ResetPassword/ResetPassword";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const AuthUser = {
    login: async (username, password) => {
        if (!username) throw { message: "Tài khoản không được để trống" };
        if (!password) throw { message: "Mật khẩu không được để trống" };
    
        try {
            const response = await api.post("/account/login", { username, password });    
            if (response.data && response.data.jwtToken) {
                localStorage.setItem("accessToken", response.data.jwtToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                return response.data;
            } else {
                throw new Error("Không nhận được jwtToken từ server");
            }
        } catch (error) {
            throw error.response?.data || { message: "Đăng nhập thất bại" };
        }
    },

    register: async (email, username, password, confirmPassword) => {
        try {
            const response = await api.post("/account/register", {
                email,
                username,
                password,
                confirmPassword,
            });
            if (response.data.status === 200) {

            } else {
                throw new Error("Đăng ký thất bại.");
            }
        } catch (error) {
            const errorData = error.response?.data || {};
        
            const errorsToLog = {};
        
            if (errorData.errors?.Email) {
                errorsToLog.email = errorData.errors.Email.join(", ");
            }
            if (errorData.errors?.Username) {
                errorsToLog.username = errorData.errors.Username.join(", ");
            }
            if (errorData.errors?.Password) {
                errorsToLog.password = errorData.errors.Password.join(", ");
            }
            if (errorData.errors?.ConfirmPassword) {
                errorsToLog.confirmPassword = errorData.errors.ConfirmPassword.join(", ");
            }
            if (errorData.message === "Tên đăng nhập đã tồn tại") {
                errorsToLog.username = "Tên đăng nhập đã tồn tại";
            }
            if (errorData.message === "Email đã tồn tại") {
                errorsToLog.email = "Email đã tồn tại";
            }
            if (errorData.message) {
                errorsToLog.message = errorData.message;
            }
        
            if (Object.keys(errorsToLog).length > 0) {
            }
        
            throw {
                ...(errorsToLog.email && { email: errorsToLog.email }),
                ...(errorsToLog.username && { username: errorsToLog.username }),
                ...(errorsToLog.password && { password: errorsToLog.password }),
                ...(errorsToLog.confirmPassword && { confirmPassword: errorsToLog.confirmPassword }),
                message: errorsToLog.message || "Có lỗi xảy ra, vui lòng thử lại.",
            };
        }
    },
    

    logout: () => {
        localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        // localStorage.removeItem("tokenExpiry");

    },

    getToken: () => {
        return localStorage.getItem("accessToken");
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
            throw { message: "Không tìm thấy refresh token" };
        }

        try {
            const response = await api.post(
                "/account/refresh-token",
                { refreshToken },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`, 
                    },
                }
            );

            if (response.data && response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                return response.data;
            } 
      } catch (error) {

        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                console.warn("Không tìm thấy refresh token. Đăng xuất người dùng...");
                AuthUser.logout(); 
            } else {
                console.warn("Refresh token không hợp lệ hoặc đã hết hạn, nhưng vẫn tồn tại refreshToken.");
            }
        }

        throw error.response?.data || { message: "Làm mới token thất bại" };
    }
    },
    close: () => {
    },
    
    forgotPassword: async (email) => {
        if (!email) {
            throw { message: "Vui lòng nhập email." };
        }
    
        try {
            const response = await api.post("/account/forgot-password", { email });
    
            if (response.status === 200) {
                return { message: "Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn." };
            } else {
                throw { message: "Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại." };
            }
        } catch (error) {
            if (error.response?.status === 400) {
                throw { message: "Email không tồn tại. Vui lòng kiểm tra lại." };
            } else {
                throw error.response?.data || { message: "Có lỗi xảy ra. Vui lòng thử lại." };
            }
        }
    },
    resetPassword: async (email, token, newPassword) => {
        if (!email || !token || !newPassword) {
            throw { message: "Vui lòng nhập đầy đủ thông tin." };
        }
    
        try {
            const response = await api.post("/account/reset-password", { email, token, newPassword });
            if (response.status === 200) {
                return { message: "Đặt lại mật khẩu thành công." };
            } else {
                throw { message: "Có lỗi xảy ra. Vui lòng thử lại." };
            }
        } catch (error) {
            if (error.response?.status === 400) {
                throw { message: "Mã xác nhận không hợp lệ hoặc đã hết hạn." };
            } else {
                throw error.response?.data || { message: "Có lỗi xảy ra. Vui lòng thử lại." };
            }
        }
    },
};