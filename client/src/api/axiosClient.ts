import axios, { type InternalAxiosRequestConfig } from "axios";

export const axiosClient = axios.create({
  baseURL: "https://task-manager-4vcm.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
