
export const validateJobDescription = (req, res, next) => {
  const { jobDescription } = req.body;

  // Check whether the input is a string
  if (typeof jobDescription !== "string") {
    return res.status(400).json({
      message: "Job description must be valid text"
    });
  }

  const trimmedJD = jobDescription.trim();

  // Reject empty job descriptions
  if (!trimmedJD) {
    return res.status(400).json({
      message: "Job description is required"
    });
  }

  // Limit job description length
  if (trimmedJD.length > 10000) {
    return res.status(400).json({
      message: "Job description must be under 10,000 characters"
    });
  }

  // Save cleaned input for the controller
  req.body.jobDescription = trimmedJD;

  next();
};
