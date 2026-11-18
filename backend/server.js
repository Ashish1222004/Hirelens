
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";

import { csrfProtection } from "./middleware/csrf.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const PORT = process.env.PORT || 3000;

// 1. Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

// 2. Parse JSON requests
app.use(express.json());

// 3. Read cookies
app.use(cookieParser());

// 4. Check origins of state-changing requests
app.use("/api", csrfProtection);

// 5. Authentication routes
app.use("/api/auth", authRoutes);

// 6. Resume routes
app.use("/api/resumes", resumeRoutes);

// 7. Global error handler (must be after routes)
app.use(errorHandler);

// 8. Connect MongoDB and start server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
