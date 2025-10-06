const prisma = require("../config/db");
const path = require("path");
const fs = require("fs");

// Helper: تحويل req.file إلى رابط نسبي
const getImageUrl = (file) => (file ? `/uploads/${file.filename}` : null);

// Helper: حذف الصورة من المجلد
const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  const filePath = path.join(__dirname, "../..", "." + imageUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Create Main Category
const createMainCategory = async (req, res) => {
  try {
    const { mainCategoryName } = req.body;
    const imageUrl = getImageUrl(req.file);

    const category = await prisma.mainCategory.create({
      data: {
        name: mainCategoryName,
        imageUrl,
      },
    });

    res.json({ message: "Main category created successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Create Sub Category
const createSubCategory = async (req, res) => {
  try {
    const { subCategoryName, mainId } = req.body;
    const imageUrl = getImageUrl(req.file);

    const parentId = Number(mainId);
    if (isNaN(parentId)) return res.status(400).json({ error: "MainId is not valid" });

    const mainCategory = await prisma.mainCategory.findUnique({ where: { id: parentId } });
    if (!mainCategory) return res.status(404).json({ error: "Main category not found" });

    const category = await prisma.subCategory.create({
      data: {
        name: subCategoryName,
        imageUrl,
        mainId: parentId,
      },
    });

    res.json({ message: "Sub category created successfully", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Main Category
const updateMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { mainCategoryName } = req.body;
    const mainCategoryId = parseInt(id);
    if (isNaN(mainCategoryId)) return res.status(400).json({ error: "MainId must be a valid number" });

    const existing = await prisma.mainCategory.findUnique({ where: { id: mainCategoryId } });
    if (!existing) return res.status(404).json({ error: "Main category not found" });

    // حذف الصورة القديمة إذا تم رفع صورة جديدة
    if (req.file) deleteImageFile(existing.imageUrl);
    const imageUrl = getImageUrl(req.file);

    const updated = await prisma.mainCategory.update({
      where: { id: mainCategoryId },
      data: {
        ...(mainCategoryName && { name: mainCategoryName }),
        ...(imageUrl && { imageUrl }),
      },
    });

    res.json({ message: "Main category updated successfully", mainCategory: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the main category" });
  }
};

// Update Sub Category
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subCategoryName, mainId } = req.body;
    const subCategoryId = parseInt(id);
    if (isNaN(subCategoryId)) return res.status(400).json({ error: "SubId must be a valid number" });

    const existing = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
    if (!existing) return res.status(404).json({ error: "Sub category not found" });

    let parentId;
    if (mainId) {
      parentId = parseInt(mainId);
      if (isNaN(parentId)) return res.status(400).json({ error: "MainId must be a valid number" });
      const mainCategory = await prisma.mainCategory.findUnique({ where: { id: parentId } });
      if (!mainCategory) return res.status(404).json({ error: "Main category not found" });
    }

    // حذف الصورة القديمة إذا تم رفع صورة جديدة
    if (req.file) deleteImageFile(existing.imageUrl);
    const imageUrl = getImageUrl(req.file);

    const updated = await prisma.subCategory.update({
      where: { id: subCategoryId },
      data: {
        ...(subCategoryName && { name: subCategoryName }),
        ...(parentId && { mainId: parentId }),
        ...(imageUrl && { imageUrl }),
      },
    });

    res.json({ message: "Sub category updated successfully", subCategory: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the sub category" });
  }
};

// Delete Main Category
const deleteMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategoryId = parseInt(id);
    if (isNaN(mainCategoryId)) return res.status(400).json({ error: "MainId must be a valid number" });

    const existing = await prisma.mainCategory.findUnique({ where: { id: mainCategoryId } });
    if (!existing) return res.status(404).json({ error: "Main category not found" });

    deleteImageFile(existing.imageUrl);

    await prisma.mainCategory.delete({ where: { id: mainCategoryId } });

    res.json({ message: "Main category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the main category" });
  }
};

// Delete Sub Category
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryId = parseInt(id);
    if (isNaN(subCategoryId)) return res.status(400).json({ error: "SubId must be a valid number" });

    const existing = await prisma.subCategory.findUnique({ where: { id: subCategoryId } });
    if (!existing) return res.status(404).json({ error: "Sub category not found" });

    deleteImageFile(existing.imageUrl);

    await prisma.subCategory.delete({ where: { id: subCategoryId } });

    res.json({ message: "Sub category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the sub category" });
  }
};

// Get All Main Categories
const getMainCategories = async (req, res) => {
  try {
    const categories = await prisma.mainCategory.findMany({ include: { subCategories: true } });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching main categories" });
  }
};

// Get Main Category By ID
const getMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategoryId = parseInt(id);
    if (isNaN(mainCategoryId)) return res.status(400).json({ error: "MainId must be a valid number" });

    const category = await prisma.mainCategory.findUnique({ where: { id: mainCategoryId }, include: { subCategories: true } });
    if (!category) return res.status(404).json({ error: "Main category not found" });

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the main category" });
  }
};

// Get Sub Category By ID
const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryId = parseInt(id);
    if (isNaN(subCategoryId)) return res.status(400).json({ error: "SubId must be a valid number" });

    const category = await prisma.subCategory.findUnique({ where: { id: subCategoryId }, include: { main: true, products: true } });
    if (!category) return res.status(404).json({ error: "Sub category not found" });

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the sub category" });
  }
};

module.exports = {
  createMainCategory,
  createSubCategory,
  updateMainCategory,
  updateSubCategory,
  deleteMainCategory,
  deleteSubCategory,
  getMainCategories,
  getMainCategoryById,
  getSubCategoryById,
};
