import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error checking admin access",
    });
  }
};
