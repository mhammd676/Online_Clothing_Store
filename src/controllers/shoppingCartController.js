const prisma = require('../config/db');

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;


    const productIdNum = parseInt(productId);
    if (isNaN(productIdNum)) {
      return res.status(400).json({ message: "ProductId must be a valid number" });
    }

    const userIdNum = parseInt(userId);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ message: "UserId must be a valid number" });
    }

    const quantityNum = parseInt(quantity) || 1;
    if (quantityNum <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const product = await prisma.product.findUnique({ where: { id: productIdNum } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < quantityNum) {
      return res.status(400).json({ message: "Not enough stock" });
    }


    let cart = await prisma.cart.findUnique({ where: { userId: userIdNum } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: userIdNum } });

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: productIdNum }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantityNum }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: productIdNum, quantity: quantityNum }
      });
    }

    res.json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};







const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const parsedUserId = parseInt(userId);

    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: "UserId must be a valid number" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: parsedUserId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    if (cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }


    const totalPrice = cart.items.reduce((acc, item) => {
      return acc + (item.product.price * item.quantity);
    }, 0);

    res.json({ 
      ...cart,
      totalPrice 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the cart" });
  }
};





const checkoutCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }


    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
      }

      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: item.product.stock - item.quantity }
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json({ message: "Checkout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addToCart , getCartByUserId ,checkoutCart};

