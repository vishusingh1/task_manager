import { Router } from "express";
import { registerUser, loginUser, me } from "../controllers/auth.controllers";
import { requireAuth } from "../middleware/auth.middleware";


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, me);

export default router;