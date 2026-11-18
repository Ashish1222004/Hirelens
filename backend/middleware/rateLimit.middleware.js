
import { rateLimit } from "express-rate-limit";

// Limit login and registration requests
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Too many authentication requests. Please try again in 15 minutes."
  }
});

// Limit Gemini AI requests per logged-in user
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  // Identify the user using their MongoDB ID
  keyGenerator: (req) => {
    return req.userId.toString();
  },

  message: {
    message:
      "Too many AI requests. Please try again shortly."
  }
});
