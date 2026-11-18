
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const SkillGap = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/resumes/history`,
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch skill gaps"
          );
        }

        setHistory(
          Array.isArray(data.history) ? data.history : []
        );

      } catch (err) {
        console.error("Skill gap error:", err);

        setError(
          err.message || "Unable to load skill gaps"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Count how often each skill appears as missing
  const skillCounts = {};

  history.forEach((analysis) => {
    const uniqueSkills = new Set(
      (analysis.missingSkills || [])
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim().toLowerCase())
        .filter(Boolean)
    );

    uniqueSkills.forEach((skill) => {
      if (!skillCounts[skill]) {
        skillCounts[skill] = {
          name: skill,
          count: 0
        };
      }

      skillCounts[skill].count += 1;
    });
  });

  const sortedSkills = Object.values(skillCounts)
    .sort((a, b) => b.count - a.count);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading skill gaps...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-3">
          Skill Gap Analysis
        </h1>

        <p className="text-gray-500 mb-8">
          Discover which skills appear most often
          in your saved resume analyses.
        </p>

        {error && (
          <div className="bg-white p-6 rounded-xl mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!error && history.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-500">
              No analyses found. Analyze a resume first
              to identify skill gaps.
            </p>
          </div>
        )}

        {!error && history.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">

            <h2 className="text-xl font-semibold mb-6">
              Most Frequently Missing Skills
            </h2>

            {sortedSkills.length === 0 && (
              <p className="text-gray-500">
                No missing skills were identified.
              </p>
            )}

            <div className="space-y-6">
              {sortedSkills.map((skill) => (
                <div key={skill.name}>

                  <div className="flex justify-between gap-4 mb-2">
                    <span className="font-medium capitalize">
                      {skill.name}
                    </span>

                    <span className="text-gray-500 text-sm">
                      {skill.count} of {history.length} analyses
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{
                        width: `${
                          (skill.count / history.length) * 100
                        }%`
                      }}
                    />
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SkillGap;
