const express = require("express");
const {registerUser, login } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/auth.middlewares");
const router = express.Router();

// register user
router.post("/register",registerUser);

// login user
router.post("/login", login);

module.exports = router;
