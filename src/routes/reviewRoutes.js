const express = require('express');
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middlewares");
const { addReview} = require('../controllers/reviewController');


router.post('/', authMiddleware,addReview);






module.exports = router;
