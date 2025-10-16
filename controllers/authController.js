import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= REGISTER =================
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    if (!name) return res.send({ message: "Name is required" });
    if (!email) return res.send({ message: "Email is required" });
    if (!password) return res.send({ message: "Password is required" });
    if (!phone) return res.send({ message: "Phone is required" });
    if (!address) return res.send({ message: "Address is required" });
    if (!answer) return res.send({ message: "Answer is required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered. Please login.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

// ================= LOGIN =================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // 🚫 Block deactivated users
    if (!user.isActive) {
      return res.status(403).send({
        success: false,
        message: "Your account has been deactivated. Contact admin.",
      });
    }

    // ✅ FIX: Ensure password comparison handles empty or invalid values
    let match = false;
    try {
      match = await comparePassword(password || "", user.password);
    } catch (err) {
      console.error("Password comparison error:", err);
      match = false;
    }

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) return res.status(400).send({ message: "Email is required" });
    if (!answer) return res.status(400).send({ message: "Answer is required" });
    if (!newPassword)
      return res.status(400).send({ message: "New password is required" });

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// ================= TEST =================
export const testController = (req, res) => {
  res.send("Protected route");
};

// ================= ADMIN: GET ALL USERS =================
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: 0 }).select("-password");
    res.status(200).send({ success: true, users });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// ================= ADMIN: TOGGLE USER STATUS =================
export const toggleUserStatusController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user || user.role === 1) {
      return res.status(400).send({
        success: false,
        message: "Cannot update admin user or user not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).send({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating user status",
      error: error.message,
    });
  }
};

// ================= GOOGLE LOGIN =================
export const googleLoginController = async (req, res) => {
  try {
    const { token } = req.body; // Google ID token

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await userModel.findOne({ email: payload.email });

    if (!user) {
      user = new userModel({
        name: payload.name,
        email: payload.email,
        phone: "N/A",
        address: "N/A",
        answer: "N/A",
      });
      await user.save();
    }

    if (!user.isActive) {
      return res.status(403).send({
        success: false,
        message: "Your account is deactivated. Contact admin.",
      });
    }

    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      token: jwtToken,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).send({
      success: false,
      message: "Invalid Google token",
      error: error.message,
    });
  }
};
