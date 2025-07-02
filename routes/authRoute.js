import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register Route
router.post("/register", registerController);

// Login Route
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Test Route (Protected and Admin Only)
router.get("/test", requireSignIn, isAdmin, testController);

// ✅ Auth Check Route (for PrivateRoute logic)
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// ✅ Admin Auth Check Route (for AdminRoute logic)
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});




export default router;
