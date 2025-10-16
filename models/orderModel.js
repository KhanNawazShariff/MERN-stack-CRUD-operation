import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // 🆕 assignment-specific fields
    customerName: String,
    email: String,
    contactNumber: String,
    shippingAddress: String,
    status: {
      type: String,
      enum: ["New", "Processing", "Shipped", "Cancelled"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
