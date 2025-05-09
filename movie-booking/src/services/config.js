import axios from "axios";
// export const BASE_URL = "https://minhtue-001-site1.ktempurl.com/api";
export const BASE_URL = "https://movieticketsv1.runasp.net/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

api.interceptors.request.use((config) => {
  const authHeaders = getAuthHeaders();
  if (authHeaders.Authorization) {
    config.headers.Authorization = authHeaders.Authorization;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

    if (status === 401) {
      message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    } else if (status === 400) {
      // message.error(errorMessage);
    }

    return Promise.reject(error);
  }
);


export default api;
