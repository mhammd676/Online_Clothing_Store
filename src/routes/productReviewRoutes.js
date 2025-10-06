const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middlewares");
const { addReview} = require('../controllers/productReviewController');


router.post('/', authMiddleware,addReview);






module.exports = router;
