import { axiosClient } from "./axiosClient";

export const AuthAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    axiosClient.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    axiosClient.post("/auth/login", data),

  me: () => axiosClient.get("/auth/me"),
};
