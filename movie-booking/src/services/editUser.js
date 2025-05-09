import api from "./config";


export const getUser = async (userId) => {
    try {
        const response = await api.get(`/account/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
        return [];
    }
};



export const updateInfo = async (userId, updatedData) => {
    try {
        const requestBody = {
            userId: userId, 
            fullName: updatedData.fullName, 
            phoneNumber: updatedData.phoneNumber, 
            avatarUrl: updatedData.avatarUrl, 
        };

        const response = await api.put(`/account/update-info`, requestBody);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        throw error;
    }
};

export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append("avatar", file); 

        const token = localStorage.getItem("accessToken"); 

        const response = await api.post(`/account/update-avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi tải ảnh lên:", error);
        throw error;
    }
};

export const changePassword = async (userId, currentPassword, newPassword, confirmPassword) => {
    try {
        const requestBody = {
            userId: userId,
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        };

        const token = localStorage.getItem("accessToken");

        const response = await api.post(`/account/change-password`, requestBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        throw error;
    }
};