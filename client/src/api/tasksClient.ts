import axios, { type InternalAxiosRequestConfig } from "axios";

export const tasksClient = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
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
