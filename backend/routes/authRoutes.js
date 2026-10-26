const express = require("express");
const { body } = require("express-validator");
const { signup, login, getMe, updateMe } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", [body("name").trim().isLength({ min: 2, max: 80 }), body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 8 })], signup);
router.post("/login", [body("email").isEmail().normalizeEmail(), body("password").notEmpty()], login);
router.get("/me", protect, getMe);
router.put("/me", protect, [body("name").optional().trim().isLength({ min: 2, max: 80 })], updateMe);

module.exports = router;
