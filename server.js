import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ENV config
dotenv.config();

// ✅ DEBUG LOG - REMOVE LATER
console.log("✅ ENV CHECK:", {
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// DB Connection
connectDB();

// App object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);


app.use("/api/user", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

// Run server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running in ${process.env.DEV_MODE} mode on port ${port}`);
});
