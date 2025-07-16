import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import { gateway } from "../config/braintree.js";

// ========== CREATE PRODUCT ==========
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo && photo.path) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.log("Create Product Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error: error.message,
    });
  }
};

// ========== GET ALL PRODUCTS ==========
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      totalcount: products.length,
      message: "All products",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};

// ========== GET SINGLE PRODUCT ==========
export const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

// ========== GET PRODUCT PHOTO ==========
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).send({ error: "No photo found" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while getting product photo",
      error,
    });
  }
};

// ========== DELETE PRODUCT ==========
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// ========== UPDATE PRODUCT ==========
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.fields;
    const { photo } = req.files;

    console.log("FIELDS:", req.fields);
    console.log("FILES:", req.files);

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    if (photo && photo.path) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log("Update Product Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in updating product",
      error,
    });
  }
};

// ========== FILTER PRODUCT ==========
export const productFilterController = async (req, res) => {
  try {
    const { checked = [], radio = [] } = req.body;

    let args = {};

    if (checked.length > 0) {
      args.category = { $in: checked };
    }

    if (radio.length === 2) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args).select("-photo");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

// ========== PRODUCT COUNT ==========
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// ========== PRODUCT LIST PER PAGE ==========
// ========== PRODUCT LIST PER PAGE ==========
export const productListController = async (req, res) => {
  try {
    const perPage = 15;  // updated from 6 to 15
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in per page product list",
      error,
    });
  }
};

// ========== SEARCH PRODUCT ==========
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.json(result);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in search product",
      error,
    });
  }
};

// ========== PRODUCTS BY CATEGORY ==========
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error while getting category products",
      error,
    });
  }
};

// ========== BRAINTREE TOKEN ==========
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({
          success: true,
          clientToken: response.clientToken,
        });
      }
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};

// ========== BRAINTREE PAYMENT ==========
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;

    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (error, result) => {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          });
          await order.save();
          res.status(200).send({ success: true, message: "Payment successful" });
        } else {
          res.status(500).send({ success: false, message: "Payment failed", error });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, error });
  }
};

// ========== GET USER ORDERS ==========
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error,
    });
  }
};
