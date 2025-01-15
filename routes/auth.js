const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  login,
  logout,
  register,
  googleSignJwt,
  authData,
  isAuthenticated,
} = require("../controllers/authController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/me", protect, authData);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    console.log("Google Auth: ", req.user);
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleSignJwt
);

router.get("/authenticated", isAuthenticated);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
