import express from "express";
import {
  createOrderController,
  getAllOrdersController,
  updateOrderStatusController,
} from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", requireSignIn, createOrderController);

// Admin only routes
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

router.put("/update-order-status/:orderId", requireSignIn, isAdmin, updateOrderStatusController);

export default router;
