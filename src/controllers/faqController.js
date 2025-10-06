const prisma = require('../config/db');

const createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category?.toUpperCase() || "ALL", 
      },
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error(" Error creating FAQ:", error);
    res.status(500).json({ message: error.message });
  }
};
const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, isActive } = req.body;

    const faq = await prisma.fAQ.update({
      where: { id: parseInt(id) },
      data: {
        question,
        answer,
        category: category?.toUpperCase(),
        isActive,
      },
    });

    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAllFAQs = async (req, res) => {
  try {
    const { category } = req.query;

    const where = {
      isActive: true,
      ...(category && category.toUpperCase() !== "ALL"
        ? { category: category.toUpperCase() }
        : {}),
    };

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid FAQ ID" });
    }


    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: parsedId },
    });

    if (!existingFAQ) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    
    await prisma.fAQ.delete({
      where: { id: parsedId },
    });

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error(" Delete FAQ failed:", error);
    res.status(500).json({ message: `Delete failed: ${error.message}` });
  }
};


module.exports = { createFAQ , updateFAQ , getAllFAQs , deleteFAQ};