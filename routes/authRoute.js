import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  getAllUsersController,
  toggleUserStatusController,
} from "../controllers/authController.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register Route
router.post("/register", registerController);

// Login Route
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Test Route (Protected and Admin Only)
router.get("/test", requireSignIn, isAdmin, testController);

// Auth Check Route (for PrivateRoute logic)
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Admin Auth Check Route (for AdminRoute logic)
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Get All Users - Admin Only
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

// Toggle User Active/Inactive - Admin Only
router.put("/toggle-user/:id", requireSignIn, isAdmin, toggleUserStatusController);

// Google Login Route
router.post("/google-login", async (req, res) => {
  const { token } = req.body; // Google ID token

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(400).json({ success: false, message: "Google email not verified" });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        // Optional: add defaults or flags for Google users
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token: jwtToken, user });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ success: false, message: "Invalid Google token" });
  }
});

export default router;
