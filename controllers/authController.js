require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { ROLES } = require("../constants");
const { authenticate } = require("passport");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("keke");

  try {
    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = user.getSignedJwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.logout = (req, res) => {
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "Strict",
//   });
//   res.status(200).json({ success: true, message: "Logged out successfully" });
// };

exports.logout = async (req, res) => {
  // req.logout();
  res.clearCookie("token"); // Clear JWT token
  res.clearCookie("connect.sid"); // Clear session cookie if using session-based auth
  res.json({ message: "Logged out successfully" });
};

exports.googleSignJwt = async (req, res) => {
  try {
    const user = req.user;

    // Generate a JWT for the user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Set the JWT in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.redirect("http://localhost:5173/customer");
  } catch (error) {
    res.status(500).json({ message: "Error in Google authentication" });
  }
};

exports.authData = async (req, res) => {
  if (req.user) {
    return res.json(req.user);
  }
  return res.status(401).json({ message: "Not authenticated" });
};

exports.isAuthenticated = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        message: "Not authorized, token failed",
        authenticated: false,
      });
    }

    return res
      .status(200)
      .json({ message: "Authenticated", authenticated: true });
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
