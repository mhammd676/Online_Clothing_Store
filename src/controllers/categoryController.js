const prisma = require("../config/db");
const path = require("path");

// creat main category
const createMainCategory = async (req, res) => {
  try {
    const { mainCategoryName } = req.body;
    const image = req.file ? req.file.path : null;

    const category = await prisma.mainCategory.create({
      data: {
        name : mainCategoryName,
        imageUrl: image,
      },
    });

    res.json({ message: "Main category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// creat sub category 
const createSubCategory = async (req, res) => {
  try {
    const { subCategoryName, mainId } = req.body;
    const image = req.file ? req.file.path : null;

    const parentId = Number(mainId);
    if (isNaN(parentId)) {
      return res.status(400).json({ error: "MainId Is Not Valid" });
    }
    const mainCategory = await prisma.mainCategory.findUnique({
      where: { id: parentId },
    });

    if (!mainCategory) {
      return res.status(404).json({ error: "mainId not found " });
    }

    const category = await prisma.subCategory.create({
      data: {
        name:subCategoryName,
        imageUrl: image,
        mainId: parseInt(mainId),
      },
    });

    res.json({ message: "Sub category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update main category 
const updateMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { mainCategoryName } = req.body;
    const image = req.file ? req.file.path : undefined;


    const mainCategoryId = parseInt(id);
    if (isNaN(mainCategoryId)) {
      return res.status(400).json({ error: "MainId must be a valid number" });
    }


    const existing = await prisma.mainCategory.findUnique({
      where: { id: mainCategoryId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Main category not found" });
    }


    const updated = await prisma.mainCategory.update({
      where: { id: mainCategoryId },
      data: {
        name: mainCategoryName,
        ...(image && { imageUrl: image }),
      },
    });

    res.status(200).json({
      message: "Main category updated successfully",
      mainCategory: updated,
    });
  } catch (err) {
    console.error(err);


    if (err.code === "P2025") {
      return res.status(404).json({ error: "Main category not found" });
    }

 
    res.status(500).json({ error: "An error occurred while updating the main category" });
  }
};


// update sub category
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subCategoryName, mainId } = req.body;
    const image = req.file ? req.file.path : undefined;


    const subCategoryId = parseInt(id);
    if (isNaN(subCategoryId)) {
      return res.status(400).json({ error: "SubId must be a valid number" });
    }


    let parentId;
    if (mainId) {
      parentId = parseInt(mainId);
      if (isNaN(parentId)) {
        return res.status(400).json({ error: "MainId must be a valid number" });
      }

      const mainCategory = await prisma.mainCategory.findUnique({
        where: { id: parentId },
      });

      if (!mainCategory) {
        return res.status(404).json({ error: "Main category (parent) not found" });
      }
    }

    const updated = await prisma.subCategory.update({
      where: { id: subCategoryId },
      data: {
        ...(subCategoryName && { name :subCategoryName }),
        ...(parentId && { mainId: parentId }),
        ...(image && { imageUrl: image }),
      },
    });

    res.status(200).json({
      message: "Sub category updated successfully",
      subCategory: updated,
    });
  } catch (err) {
    console.error(err);

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Sub category not found" });
    }

    res.status(500).json({ error: "An error occurred while updating the sub category" });
  }
};



// delete main category
const deleteMainCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategoryId = parseInt(id);

    if (isNaN(mainCategoryId)) {
      return res.status(400).json({ error: "MainId must be a valid number" });
    }

    await prisma.mainCategory.delete({
      where: { id: mainCategoryId },
    });

    res.json({ message: "Main category deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Main category not found" });
    }
    res.status(500).json({ error: "An error occurred while deleting the main category" });
  }
};


// delete sub category
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryId = parseInt(id);

    if (isNaN(subCategoryId)) {
      return res.status(400).json({ error: "SubId must be a valid number" });
    }

    await prisma.subCategory.delete({
      where: { id: subCategoryId },
    });

    res.json({ message: "Sub category deleted successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Sub category not found" });
    }
    res.status(500).json({ error: "An error occurred while deleting the sub category" });
  }
};



const getMainCategories = async (req, res) => {
  try {
    const categories = await prisma.mainCategory.findMany({
      include: { subCategories: true },
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching main categories" });
  }
};

// get main category by id
const getMainCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const mainCategoryId = parseInt(id);

    if (isNaN(mainCategoryId)) {
      return res.status(400).json({ error: "MainId must be a valid number" });
    }

    const category = await prisma.mainCategory.findUnique({
      where: { id: mainCategoryId },
      include: { subCategories: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Main category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the main category" });
  }
};


// get sub category by id
const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryId = parseInt(id);

    if (isNaN(subCategoryId)) {
      return res.status(400).json({ error: "SubId must be a valid number" });
    }

    const category = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
      include: { main: true, products: true },
    });

    if (!category) {
      return res.status(404).json({ error: "Sub category not found" });
    }

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
