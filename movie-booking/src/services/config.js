import axios from "axios";

export const BASE_URL = "http://minhtue-001-site1.ktempurl.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
