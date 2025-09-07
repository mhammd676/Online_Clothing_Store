const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middlewares");
const {
  getProducts,
  getProductById
} = require('../controllers/productController');



router.get('/',authMiddleware, getProducts);


router.get("/:id",authMiddleware,getProductById)

module.exports = router;
