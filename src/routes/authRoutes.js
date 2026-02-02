const express = require("express");
const authController = require("../controllers/authController");
const { loginValidators } = require("../validators/authValidators");

const router = express.Router();

/* ================= GOOGLE AUTH ================= */
router.post("/google-auth", authController.googleSso);

/* ================= LOGIN ================= */
router.post(
    "/login",
    loginValidators, // ✅ validation middleware
    authController.login // ✅ controller
);

/* ================= REGISTER ================= */
router.post(
    "/register",
    authController.register
);

/* ================= IS USER LOGGED IN ================= */
router.post(
    "/is-user-logged-in",
    authController.isUserLoggedIn
);

/* ================= LOGOUT ================= */
router.post(
    "/logout",
    authController.logout
);

module.exports = router;