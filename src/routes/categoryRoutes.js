const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middlewares");


const {
  getMainCategories,
  getMainCategoryById,
  getSubCategoryById,
} = require("../controllers/categoryController");

// ================== Main Categories ==================

// Get_MainCategory&&SubCategory
router.get("/main",authMiddleware, getMainCategories);

// Get_MainCategory_ById 
router.get("/main/:id",authMiddleware, getMainCategoryById);

// ================== Sub Categories ==================

// Get_SubCategory_ById
router.get("/sub/:id", getSubCategoryById);

module.exports = router;
