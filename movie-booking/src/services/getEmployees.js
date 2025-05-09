import api from "./config";

export const getEmployees = async () => {
    try {
      const response = await api.get(`/account`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      return []; 
    }
  };

  
  export const createEmployees = async (data) => {
    try {
      const response = await api.post('/account/create-user', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      return null;
    }
  };
  
  