
import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    resumeName: {
      type: String,
      required: true
    },

    jobDescription: {
      type: String,
      required: true
    },

    matchingSkills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    suggestions: {
      type: [String],
      default: []
    },

    learningRoadmap: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
