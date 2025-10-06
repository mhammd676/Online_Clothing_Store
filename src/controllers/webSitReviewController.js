const prisma = require('../config/db');
// create Review 
const createSiteReview = async (req, res) => {
  try {
    const { rating, comment, userId } = req.body;


    if (!userId) {
      return res.status(400).json({ message: "userId is not found" });
    }

    const review = await prisma.siteReview.create({
      data: {
        rating: rating || null,
        comment: comment || null,
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: `Review Falied :${error}` });
  }
};

// Get All Reviews
const getAllWebSiteReviews = async (req, res) => {
  try {
    const reviews = await prisma.siteReview.findMany({
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// update isApprove {true , false}
const approveSiteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await prisma.siteReview.update({
      where: { id: parseInt(id) },
      data: { isApproved },
    });

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Review Falied :${error}` });
  }
};

// delete Review
const deleteSiteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }
    const review = await prisma.siteReview.findUnique({
      where: { id: parsedId },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await prisma.siteReview.delete({
      where: { id: parsedId },
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(" Delete failed:", error);
    res.status(500).json({ message: `Delete failed: ${error.message}` });
  }
};


module.exports = {
  createSiteReview,
  getAllWebSiteReviews,
  approveSiteReview,
  deleteSiteReview,
}
