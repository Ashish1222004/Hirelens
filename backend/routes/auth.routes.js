
import express from "express";

import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Register a new user
router.post("/register", authLimiter, registerUser);

// Login an existing user
router.post("/login", authLimiter, loginUser);

// Get logged-in user's information
router.get("/me", protect, getCurrentUser);

// Logout user
router.post("/logout", logoutUser);

export default router;
