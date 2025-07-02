import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import jwt from "jsonwebtoken";

// REGISTER
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

// LOGIN
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

    const match = await comparePassword(password, user.password);
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

// FORGOT PASSWORD
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New password is required" });
    }

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

// TEST CONTROLLER
export const testController = (req, res) => {
  res.send("Protected route");
};
