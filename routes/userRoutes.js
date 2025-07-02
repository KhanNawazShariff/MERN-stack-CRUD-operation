import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { updateProfileController } from "../controllers/userController.js";

const router = express.Router();

// Update user profile
router.put("/profile", requireSignIn, updateProfileController);

export default router;
