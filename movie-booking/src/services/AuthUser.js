import axios from "axios";
import { BASE_URL } from "./config";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

export const AuthUser = {
    login: async (username, password) => {
        if (!username) {
            throw { message: "Tài khoản không được để trống" };
        }
        if (!password) {
            throw { message: "Mật khẩu không được để trống" };
        }
        try {
            const response = await api.post("/account/login", { username, password });
            if (response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
                console.log("accessToken");
            }
            return response.data;
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
            console.log("Đăng ký thành công:", response.data);
            return response.data;
        } catch (error) {
            const errorData = error.response?.data || { message: "Đăng ký thất bại" };
            console.error("Lỗi đăng ký:", errorData);
    
            throw {
                email: errorData.email || "Email already taken",
                username: errorData.username || "Username already taken",
                password: errorData.password || "Passwords must be at least 8 characters",
                confirmPassword: errorData.confirmPassword || "",
                message: errorData.message || "Có lỗi xảy ra, vui lòng thử lại.",
            };
        }
    },
    

    logout: () => {
        localStorage.removeItem("accessToken");
    },

    getToken: () => {
        return localStorage.getItem("accessToken");
    },
};
