import Order from "../models/orderModel.js";

// Create order
export const createOrderController = async (req, res) => {
  try {
    const { products, paymentMethod, paymentStatus, address } = req.body;
    const userId = req.user._id;

    if (!products || products.length === 0) {
      return res.status(400).send({ message: "Cart is empty" });
    }

    if (paymentMethod === "COD" && !address) {
      return res.status(400).send({ message: "Address is required for COD" });
    }

    const order = new Order({
      products,
      payment: {
        method: paymentMethod,
        status: paymentStatus || (paymentMethod === "Card" ? "Completed" : "Pending"),
      },
      address: paymentMethod === "COD" ? address : "",
      buyer: userId,
      status: "Not process",
    });

    await order.save();

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error placing order",
      error,
    });
  }
};

// Get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error,
    });
  }
};

// Update order status
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({
        success: false,
        message: "Status is required",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("buyer", "name email");

    if (!updatedOrder) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating order status",
      error,
    });
  }
};
