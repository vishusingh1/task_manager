import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createTask,
  getMyTasks,
  getTaskSummary,
  getRecentTasks,
} from "../controllers/task.controllers";

const router = Router();

router.post("/", requireAuth, createTask);
router.get("/", requireAuth, getMyTasks);
router.get("/summary", requireAuth, getTaskSummary);
router.get("/recent", requireAuth, getRecentTasks);

export default router;
