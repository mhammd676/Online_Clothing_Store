const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const fs = require("fs");
const path = require('path');
// Middleware
app.use(cors());
app.use(express.json());


const UPLOADS_FOLDER = path.join(__dirname, "../uploads");

if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

app.use("/uploads", express.static(UPLOADS_FOLDER));

// Routes
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productsRoutes = require('./routes/prudactRoutes');
const productReviewsRoutes =require("./routes/productReviewRoutes");
const shoppingCartRoutes=require("./routes/shoppingCartRoutes");
const webSitReviewRoutes = require("./routes/webSitReviewRoutes");
// تسجيل الـ Routes
app.use("/api/auth", authRoutes); // تسجيل الدخول والتسجيل
app.use("/api/dashboard", adminRoutes); // لوحة تحكم الـ Admin
app.use("/api/categories", categoryRoutes);
app.use("/api/product",productsRoutes);
app.use("/api/reviews",productReviewsRoutes);
app.use("/api/cart",shoppingCartRoutes);
app.use("/api/webSit",webSitReviewRoutes);


// Route تجريبية
app.get("/", (req, res) => {
  res.send("Server is running...");
});

module.exports = app;
