import api from "./config";

export const getActors = async ({ page = 1, pageSize = 100, search = "" } = {}) => {
    try {
        const response = await api.get(`/actors`, {
            params: {
                page,
                pageSize,
                search,
            },
        });

        const result = response.data;
        const actors = result?.data || [];
        return actors.map((actor) => ({
            id: actor.id,
            name: actor.name,
            image: actor.imageURL || "https://via.placeholder.com/100x150?text=No+Image",
        }));
    } catch (error) {
        console.error("Lỗi khi lấy danh sách diễn viên:", error);
        return [];
    }
};