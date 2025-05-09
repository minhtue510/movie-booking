import api from "./config";

export const getAgeRatings = async () => {
    try {
        const response = await api.get(`/age-ratings`);
        return response.data?.data || []; 
    } catch (error) {
        console.error("Lỗi khi lấy danh sách giới hạn độ tuổi:", error);
        return [];
    }
};