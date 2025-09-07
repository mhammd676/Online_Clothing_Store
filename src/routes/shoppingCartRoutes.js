const Router =require('express')
const router = Router();

const { authMiddleware } = require("../middlewares/auth.middlewares");
const { getCartByUserId, checkoutCart, addToCart } =require ('../controllers/shoppingCartController');

router.post("/" , authMiddleware, addToCart);
router.get("/:userId", authMiddleware, getCartByUserId);
router.post("/checkOut", authMiddleware, checkoutCart)



module.exports= router;
