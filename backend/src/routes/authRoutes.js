const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/admin/register", authController.adminRegister);
router.post("/user/register", authController.userRegister);

router.post("/admin/login", authController.adminLogin);
router.post("/user/login", authController.userLogin);

module.exports = router;
