
import { PDFParse } from "pdf-parse";
import { generateLatexResume } from "../services/latex.service.js";

export const createLatexResume = async (req, res) => {
  let parser;

  try {
    const { jobDescription } = req.body;

    // Check if resume PDF was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume PDF"
      });
    }

    // Check if job description is provided
    if (
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        message: "Please provide a job description"
      });
    }

    // Check PDF signature
    const header = req.file.buffer
      .subarray(0, 5)
      .toString("ascii");

    if (header !== "%PDF-") {
      return res.status(400).json({
        message: "Invalid PDF file"
      });
    }

    // Extract text from uploaded resume
    parser = new PDFParse({
      data: new Uint8Array(req.file.buffer)
    });

    const result = await parser.getText();
    const resumeText = result.text.trim();

    if (!resumeText) {
      return res.status(422).json({
        message: "No readable resume text found"
      });
    }

    // Generate LaTeX using Gemini
    const latexCode = await generateLatexResume(
      resumeText,
      jobDescription.trim()
    );

    if (!latexCode) {
      return res.status(502).json({
        message: "Gemini returned an empty LaTeX response"
      });
    }

    return res.status(200).json({
      message: "LaTeX resume generated successfully",
      latexCode
    });

  } catch (error) {
    console.error("LaTeX generation error:", error.message);

    return res.status(500).json({
      message: "Unable to generate LaTeX resume right now"
    });

  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
};
