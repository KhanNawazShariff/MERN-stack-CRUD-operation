import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "product",
      },
    ],
    payment: {
      method: {
        type: String,
        enum: ["Card", "COD"],
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },
      // you can store other payment details here if needed
    },
    address: {
      type: String,
      required: function () {
        return this.payment.method === "COD";
      },
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not process",
      enum: ["Not process", "Processing", "Shipped", "Delivered", "Cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
