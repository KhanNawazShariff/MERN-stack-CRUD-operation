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
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order status", error: error.message });
  }
};


// ADMIN DASHBOARD STATS
export const adminDashboardController = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await orderModel.find({ createdAt: { $gte: today } });
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const lowStockProducts = await productModel.find({ stock: { $lt: 5 } });

    res.status(200).json({
      success: true,
      data: {
        totalOrders: todayOrders.length,
        totalRevenue: todayRevenue,
        lowStock: lowStockProducts.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching dashboard stats", error: error.message });
  }
};
