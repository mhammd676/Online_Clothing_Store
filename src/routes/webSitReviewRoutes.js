const Router =require('express')
const router = Router();
const { authMiddleware, authorize } = require("../middlewares/auth.middlewares.js");
const {
  createSiteReview,
} =require ("../controllers/webSitReviewController.js");


router.post("/",authMiddleware, createSiteReview);


module.exports= router;
