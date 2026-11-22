import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.url === "/auth/login") {
    console.log("LOGIN URL:", config.baseURL + config.url);
    console.log("LOGIN EMAIL:", config.data?.email);
  }

  const token = localStorage.getItem("campusconnect_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;