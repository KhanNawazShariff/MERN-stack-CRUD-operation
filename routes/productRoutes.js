import express from "express";
import {
  createProductController,
  getProductController,
  getSingleProduct,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  productCategoryController, // ✅ For category filtering
  braintreeTokenController,
  braintreePaymentController,
  getOrdersController, // ✅ Optional: Orders if needed here
} from "../controllers/productController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

// ========== PRODUCT ROUTES ==========
router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController);
router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProduct);
router.get("/product-photo/:pid", productPhotoController);
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProductController);
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);

// ========== FILTER ==========
router.post("/product-filters", productFilterController);

// ========== PAGINATION ==========
router.get("/product-count", productCountController);
router.get("/product-list/:page", productListController);

// ========== SEARCH ==========
router.get("/search/:keyword", searchProductController);

// ========== CATEGORY FILTER ROUTE (✅ FIXED) ==========
router.get("/category/:slug", productCategoryController);

// ========== BRAINTREE PAYMENT ==========
router.get("/braintree/token", braintreeTokenController);
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

// ========== (Optional) ORDERS for ADMIN/USER ==========
router.get("/orders", requireSignIn, getOrdersController); // remove if not used here

export default router;
