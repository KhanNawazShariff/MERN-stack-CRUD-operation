import express from "express";
import {
  createOrderController,
  getAllOrdersController,
  updateOrderStatusController,
  adminDashboardController, // <-- add this
} from "../controllers/orderController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/create-order", requireSignIn, createOrderController);

// Admin routes
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/update-order-status/:orderId", requireSignIn, isAdmin, updateOrderStatusController);
router.patch("/status/:id", requireSignIn, isAdmin, updateOrderStatusController);
router.get("/admin/dashboard", requireSignIn, isAdmin, adminDashboardController);

export default router;
