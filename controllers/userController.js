import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";

// ========== REGISTER ==========
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Already registered. Please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user
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
    console.log("Register Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

// ========== LOGIN ==========
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Email not registered" });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).send({
      success: false,
      message: "Login failed",
      error,
    });
  }
};

// ========== FORGOT PASSWORD ==========
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email || !answer || !newPassword) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Wrong email or answer" });
    }

    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// ========== UPDATE PROFILE ==========
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    if (password && password.length < 6) {
      return res
        .status(400)
        .send({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = password
      ? await hashPassword(password)
      : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating profile",
      error,
    });
  }
};

// ========== TEST ==========
export const testController = (req, res) => {
  res.send("Protected Route");
};

// ========== SAVE CART ==========
export const saveCartController = async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await userModel.findById(req.user._id);
    user.cart = cart;
    await user.save();
    res.status(200).send({ success: true, message: "Cart saved" });
  } catch (error) {
    console.log("Save Cart Error:", error);
    res.status(500).send({
      success: false,
      message: "Error saving cart",
      error,
    });
  }
};

// ========== LOAD CART ==========
export const loadCartController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("cart");
    res.status(200).send({
      success: true,
      cart: user.cart || [],
    });
  } catch (error) {
    console.log("Load Cart Error:", error);
    res.status(500).send({
      success: false,
      message: "Error loading cart",
      error,
    });
  }
};
