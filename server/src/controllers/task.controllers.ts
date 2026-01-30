import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { TaskService } from "../services/task.service";

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = await TaskService.createTask({
    title,
    description,
    priority,
    userId: req.user.id,
  });

  res.status(201).json(task);
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tasks = await TaskService.getUserTasks(req.user.id);
  res.json(tasks);
};

export const getTaskSummary = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const summary = await TaskService.getSummary(req.user.id);
  res.json(summary);
};

export const getRecentTasks = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const tasks = await TaskService.getRecentTasks(req.user.id, 4);
  res.json(tasks);
};
