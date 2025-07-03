import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false, // Changed
    },
    address: {
      type: String,
      required: false, // Changed
    },
    password: {
      type: String,
      required: false, // Changed
    },
    answer: {
      type: String,
      required: false, // Changed
    },
    googleId: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
