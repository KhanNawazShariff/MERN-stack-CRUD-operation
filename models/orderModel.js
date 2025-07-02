import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "product",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not process",
      enum: ["Not process", "Processing", "shipped", "delivered", "cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
