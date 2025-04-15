import axios from "axios";

export const BASE_URL = "https://minhtue-001-site1.ktempurl.com/api";

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

export default api;
