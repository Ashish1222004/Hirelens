
import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

import { aiLimiter } from "../middleware/rateLimit.middleware.js";

import {
  validateJobDescription
} from "../middleware/validateJD.middleware.js";

import {
  uploadResume,
  analyzeResume
} from "../controllers/resume.controller.js";

import {
  tailorResume,
  downloadTailoredResume
} from "../controllers/tailor.controller.js";

import {
  createLatexResume
} from "../controllers/latex.controller.js";

import {
  getAnalysisHistory
} from "../controllers/history.controller.js";

const router = express.Router();

// Upload PDF and extract its text
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// Analyze resume using Gemini
router.post(
  "/analyze",
  protect,
  aiLimiter,
  upload.single("resume"),
  validateJobDescription,
  analyzeResume
);

// Generate tailored resume using Gemini
router.post(
  "/tailor",
  protect,
  aiLimiter,
  upload.single("resume"),
  validateJobDescription,
  tailorResume
);

// Download tailored resume as PDF
router.post(
  "/tailor/download",
  protect,
  aiLimiter,
  upload.single("resume"),
  validateJobDescription,
  downloadTailoredResume
);

// Generate tailored LaTeX resume
router.post(
  "/tailor/latex",
  protect,
  aiLimiter,
  upload.single("resume"),
  validateJobDescription,
  createLatexResume
);

// Get saved analysis history
router.get(
  "/history",
  protect,
  getAnalysisHistory
);

export default router;
