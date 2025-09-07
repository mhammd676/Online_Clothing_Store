const express = require("express");
const {registerUser, login } = require("../controllers/authController");

const router = express.Router();

// register user
router.post("/register", registerUser);

// login user
router.post("/login", login);

module.exports = router;
