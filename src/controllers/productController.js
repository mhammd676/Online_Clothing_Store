const prisma = require('../config/db');
const path = require("path");
const fs = require("fs");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { productName, description, price, subId, stock } = req.body; 

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; 
    }

    const subCategoryIdNum = parseInt(subId);
    if (isNaN(subCategoryIdNum)) {
      return res.status(400).json({ error: "SubId must be a valid number" });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
      return res.status(400).json({ error: "Price must be a valid number" });
    }

    const stockNum = stock !== undefined ? parseInt(stock) : 0; 
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ error: "Stock must be a valid non-negative number" });
    }

    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryIdNum },
    });
    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    const product = await prisma.product.create({
      data: {
        name: productName,
        description,
        price: priceNum,
        stock: stockNum,
        subCategoryId: subCategoryIdNum,
        imageUrl, 
      },
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while creating the product" });
  }
};


// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, description, price, subId, stock } = req.body; 

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "ProductId must be a valid number" });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const data = {};
    if (productName) data.name = productName;
    if (description) data.description = description;

    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum)) {
        return res.status(400).json({ error: "Price must be a valid number" });
      }
      data.price = priceNum;
    }

    if (stock !== undefined) { 
      const stockNum = parseInt(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ error: "Stock must be a valid non-negative number" });
      }
      data.stock = stockNum;
    }

    if (subId !== undefined) {
      const subCategoryIdNum = parseInt(subId);
      if (isNaN(subCategoryIdNum)) {
        return res.status(400).json({ error: "SubId must be a valid number" });
      }

      const subCategory = await prisma.subCategory.findUnique({
        where: { id: subCategoryIdNum },
      });
      if (!subCategory) {
        return res.status(404).json({ error: "SubCategory not found" });
      }

      data.subCategoryId = subCategoryIdNum;
    }


    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data,
    });

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "An error occurred while updating the product" });
  }
};



const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "ProductId must be a valid number" });
    }

  
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.imageUrl) {
      const imagePath = path.join(__dirname, "../..", product.imageUrl); 
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product and image deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).json({ error: "An error occurred while deleting the product" });
  }
};

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        subCategory: {
          include: { main: true },
        },
        reviews: true,
      },
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching products" });
  }
};

// Get Product By Id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "ProductId must be a valid number" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        subCategory: {
          select: {
            name: true,
            main: { select: { name: true } },
          },
        },
        reviews: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the product" });
  }
};


// Add Product to Favorites
const addFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId are required" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: Number(userId),
        productId: Number(productId),
      },
    });

    res.json({ message: "Added to favorite", favorite });
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Already in favorites" });
    }
    res.status(500).json({ error: "An error occurred while adding to favorites" });
  }
};



const getFavoritesByUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid userId" });

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            subCategory: { include: { main: true } },
            reviews: true,
          },
        },
      },
    });

    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching favorites" });
  }
};


// Remove from Favorites
const removeFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(productId),
        },
      },
    });

    res.json({ message: "Removed from favorite" });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.status(500).json({ error: "Error removing from favorites" });
  }
};


module.exports = { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProducts, 
  getProductById,
  addFavorite,
  getFavoritesByUser,
  removeFavorite
};

