
import multer from "multer";

// Store uploaded files in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  // Maximum file size: 5 MB
  limits: {
    fileSize: 5 * 1024 * 1024,

    // Maximum size of each text field: 10 KB
    fieldSize: 10 * 1024,

    // Allow only one uploaded file
    files: 1,

    // Allow up to one text field
    fields: 1,

    // Allow up to two multipart parts
    parts: 2
  },

  // Check the uploaded file
  fileFilter: (req, file, cb) => {
    const isPDF =
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return cb(
        new Error("Only PDF resumes are allowed")
      );
    }

    cb(null, true);
  }
});

export { upload };
