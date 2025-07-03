import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  testController,
  saveCartController,
  loadCartController,
} from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

// Router object
const router = express.Router();

// Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

// Protected route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Update profile
router.put("/profile", requireSignIn, updateProfileController);

// Admin test route (can customize later)
router.get("/test", requireSignIn, testController);

// Save cart to DB
router.post("/save-cart", requireSignIn, saveCartController);

// Load cart from DB
router.get("/load-cart", requireSignIn, loadCartController);

export default router;
