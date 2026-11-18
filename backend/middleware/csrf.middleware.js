
export const csrfProtection = (req, res, next) => {
  // Safe methods don't modify application data
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const allowedOrigin =
    process.env.FRONTEND_URL || "http://localhost:5173";

  const requestOrigin = req.get("Origin");

  // Reject requests without an Origin header
  if (!requestOrigin) {
    return res.status(403).json({
      message: "Request origin is missing"
    });
  }

  // Reject requests from unauthorized websites
  if (requestOrigin !== allowedOrigin) {
    return res.status(403).json({
      message: "Request origin is not allowed"
    });
  }

  next();
};
