import express from "express";
import {
  getCategoryController, // ✅ updated here
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import categoryModel from "../models/categoryModel.js";

const router = express.Router();

// Create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// Update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//get categoryModel
router.get("/get-category", getCategoryController);


//single route
router.get("/single-category/:slug", singleCategoryController);

//delete
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);
export default router;
