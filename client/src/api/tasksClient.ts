import axios, { type InternalAxiosRequestConfig } from "axios";

export const tasksClient = axios.create({
  baseURL: "https://task-manager-4vcm.onrender.com/api/tasks",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token
tasksClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
