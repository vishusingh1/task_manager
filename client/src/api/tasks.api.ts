import { axiosClient } from "./axiosClient";

export const TasksAPI = {
  create: (data: {
    title: string;
    description?: string;
    priority: string;
  }) => axiosClient.post("/tasks", data),

  list: () => axiosClient.get("/tasks"),

  summary: () => axiosClient.get("/tasks/summary"),

  recent: () => axiosClient.get("/tasks/recent"),
};
