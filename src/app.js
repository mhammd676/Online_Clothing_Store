const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productsRoutes = require('./routes/prudactRoutes');
const reviewsRoutes =require("./routes/reviewRoutes");
const shoppingCartRoutes=require("./routes/shoppingCartRoutes");

// تسجيل الـ Routes
app.use("/api/auth", authRoutes); // تسجيل الدخول والتسجيل
app.use("/api/dashboard", adminRoutes); // لوحة تحكم الـ Admin
app.use("/api/categories", categoryRoutes);
app.use("/api/product",productsRoutes);
app.use("/api/reviews",reviewsRoutes);
app.use("/api/cart",shoppingCartRoutes);


// Route تجريبية
app.get("/", (req, res) => {
  res.send("Server is running...");
});

module.exports = app;
