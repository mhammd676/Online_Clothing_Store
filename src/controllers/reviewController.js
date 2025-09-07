const prisma = require('../config/db');

// add review to product
const addReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;


    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!rating && !comment) {
      return res.status(400).json({ message: "You must provide either a rating or a comment" });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: rating || null,
        comment: comment || null,
      },
    });

    res.status(202).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: { 
        user: {
          select: { first_name: true, last_name: true, email: true } // اسمه و الايميل
        }
      },
    });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewId = parseInt(id);

    if (isNaN(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    // تحقق من وجود الـ review
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existingReview) {
      return res.status(404).json({ message: "Review ID not found" });
    }

    await prisma.review.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviewsByProduct, deleteReview };

