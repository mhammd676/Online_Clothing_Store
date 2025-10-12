const Router =require('express')
const router = Router();

const { authMiddleware } = require("../middlewares/auth.middlewares");
const { getCartByUserId, checkoutCart, addToCart , updateCartItemQuantity , removeFromCart} =require ('../controllers/shoppingCartController');

router.post("/" , authMiddleware, addToCart);
router.get("/:userId", authMiddleware, getCartByUserId);
router.post("/checkOut", authMiddleware, checkoutCart);
router.put('/updateQuantity',authMiddleware,updateCartItemQuantity);
router.delete('/removeFromCart', authMiddleware, removeFromCart);



module.exports= router;
