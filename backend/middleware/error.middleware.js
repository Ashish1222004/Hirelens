
import multer from "multer";

// Global error-handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("API Error:", err.message);

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Resume must be smaller than 5 MB"
      });
    }

    if (err.code === "LIMIT_FIELD_VALUE") {
      return res.status(413).json({
        message: "Job description is too long"
      });
    }

    if (
      err.code === "LIMIT_FILE_COUNT" ||
      err.code === "LIMIT_UNEXPECTED_FILE" ||
      err.code === "LIMIT_PART_COUNT" ||
      err.code === "LIMIT_FIELD_COUNT"
    ) {
      return res.status(400).json({
        message: "Invalid upload. Please provide one PDF resume and a job description."
      });
    }

    return res.status(400).json({
      message: "File upload failed"
    });
  }

  // Handle invalid PDF file types
  if (err.message === "Only PDF resumes are allowed") {
    return res.status(400).json({
      message: err.message
    });
  }

  // Handle malformed JSON requests
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request"
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    message: "Internal server error"
  });
};
