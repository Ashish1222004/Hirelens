
import Analysis from "../models/analysis.model.js";

export const getAnalysisHistory = async (req, res) => {
  try {
    // Find analyses belonging to the logged-in user
    const history = await Analysis.find({
      user: req.userId
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      message: "Analysis history fetched successfully",
      count: history.length,
      history
    });

  } catch (error) {
    console.error("History fetch error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch analysis history"
    });
  }
};
