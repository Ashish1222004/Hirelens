
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const AnalyzeResume = () => {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
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
    setAnalysis(null);

    try {
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
        `${API_URL}/api/resumes/analyze`,
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      
if (response.status === 429) {
  throw new Error(
    "You have reached your AI request limit. Please try again in about a minute."
  );
}

if (!response.ok) {
  throw new Error(
    data.message || "Failed to analyze resume"
  );
}


      setAnalysis(data.analysis);

    } catch (err) {
      console.error("Resume analysis error:", err);

      setError(
        err.message || "Unable to analyze resume"
      );
    } finally {
      setLoading(false);
    }
  };

  const resultSections = [
    {
      title: "Matching Skills",
      items: analysis?.matchingSkills,
      color: "text-green-700"
    },
    {
      title: "Missing Skills",
      items: analysis?.missingSkills,
      color: "text-red-600"
    },
    {
      title: "Improvement Suggestions",
      items: analysis?.suggestions,
      color: "text-blue-700"
    },
    {
      title: "Learning Roadmap",
      items: analysis?.learningRoadmap,
      color: "text-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-3">
          AI Resume Analyzer
        </h1>

        <p className="text-gray-500 mb-8">
          Compare your resume with a job description
          using Gemini AI.
        </p>

        <form onSubmit={handleAnalyze}>
          <label
            htmlFor="resume"
            className="block font-medium mb-2"
          >
            Upload Resume (PDF)
          </label>

          <input
            id="resume"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) =>
              setResume(e.target.files[0] || null)
            }
            className="mb-6 w-full border p-3 rounded-lg"
          />

          <label
            htmlFor="jobDescription"
            className="block font-medium mb-2"
          >
            Job Description
          </label>

          <textarea
            id="jobDescription"
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
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 mt-5">
            {error}
          </p>
        )}

        {analysis && (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-bold">
              Analysis Results
            </h2>

            {resultSections.map((section) => (
              <div
                key={section.title}
                className="bg-gray-50 p-5 rounded-lg border"
              >
                <h3
                  className={`text-xl font-semibold mb-3 ${section.color}`}
                >
                  {section.title}
                </h3>

                {Array.isArray(section.items) &&
                section.items.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    No items found.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyzeResume;
