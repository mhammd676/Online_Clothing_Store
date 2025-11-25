const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middlewares");
const {
  getProducts,
  getProductById,
  addFavorite,
  getFavoritesByUser,
  removeFavorite
} = require('../controllers/productController');



router.get('/',authMiddleware, getProducts);


router.get("/:id",authMiddleware,getProductById)

router.post("/addFavorite",authMiddleware,addFavorite)

router.delete("/removeFavorite",authMiddleware,removeFavorite)

router.get("/getFavoritesById/:id",authMiddleware,getFavoritesByUser)

module.exports = router;
