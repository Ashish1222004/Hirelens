
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const TailorResume = () => {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [latexCode, setLatexCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate LaTeX resume using Gemini
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!resume || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description");
      return;
    }

    if (
      resume.type !== "application/pdf" &&
      !resume.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file");
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB");
      return;
    }

    setLoading(true);
    setError("");
    setLatexCode("");
    setCopied(false);

    try {
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        `${API_URL}/api/resumes/tailor/latex`,
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      const data = await response.json();

      // Redirect if the user is not authenticated
      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      // Handle AI rate limit exceeded
      if (response.status === 429) {
        throw new Error(
          "You have reached your AI request limit. Please try again in about a minute."
        );
      }

      // Handle other API errors
      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate LaTeX resume"
        );
      }

      // Validate the returned LaTeX code
      if (
        typeof data.latexCode !== "string" ||
        !data.latexCode.trim()
      ) {
        throw new Error("No LaTeX code was returned");
      }

      setLatexCode(data.latexCode);

    } catch (err) {
      console.error("LaTeX generation error:", err);
      setError(err.message || "Unable to generate resume");
    } finally {
      setLoading(false);
    }
  };

  // Copy generated LaTeX to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setError("");
    } catch {
      setError("Unable to copy LaTeX code");
    }
  };

  // Download generated LaTeX as a .tex file
  const handleDownload = () => {
    if (!latexCode) return;

    const blob = new Blob([latexCode], {
      type: "application/x-tex;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tailored-resume.tex";

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Release the temporary URL after download starts
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-3">
          AI Resume Tailoring
        </h1>

        <p className="text-gray-500 mb-8">
          Generate an ATS-friendly LaTeX resume tailored
          to your job description.
        </p>

        <form onSubmit={handleGenerate}>
          <label
            htmlFor="tailorResume"
            className="block font-medium mb-2"
          >
            Upload Resume (PDF)
          </label>

          <input
            id="tailorResume"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) =>
              setResume(e.target.files[0] || null)
            }
            className="w-full border p-3 rounded-lg mb-6"
          />

          <label
            htmlFor="tailorJD"
            className="block font-medium mb-2"
          >
            Job Description
          </label>

          <textarea
            id="tailorJD"
            rows={8}
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            placeholder="Paste the job description here..."
            className="w-full border p-3 rounded-lg mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate LaTeX Resume"}
          </button>
        </form>

        {/* Display errors */}
        {error && (
          <p className="text-red-600 mt-5">
            {error}
          </p>
        )}

        {/* Display generated LaTeX */}
        {latexCode && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Your Tailored LaTeX Resume
            </h2>

            <div className="flex flex-wrap gap-3 mb-5">
              <button
                type="button"
                onClick={handleCopy}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
              >
                {copied ? "Copied!" : "Copy LaTeX"}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-3 rounded-lg"
              >
                Download .tex
              </button>
            </div>

            <pre className="bg-gray-900 text-green-300 p-5 rounded-lg overflow-auto max-h-96 text-sm whitespace-pre-wrap">
              {latexCode}
            </pre>

            <p className="text-gray-500 mt-4 text-sm">
              Copy this code into Overleaf to compile your resume
              into a PDF. Review all details before applying.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TailorResume;
