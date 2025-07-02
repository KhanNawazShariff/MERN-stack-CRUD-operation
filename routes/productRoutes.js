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
  productCategoryController,
  braintreeTokenController,
  braintreePaymentController,
  getOrdersController   // ✅ Add this line
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

// ========== CATEGORY ==========
router.get("/product-category/:slug", productCategoryController);

// ========== BRAINTREE PAYMENT ==========
router.get("/braintree/token", braintreeTokenController);               // ✅ FIXED
router.post("/braintree/payment", requireSignIn, braintreePaymentController); // ✅ FIXED

router.get("/orders", requireSignIn, getOrdersController);


export default router;
