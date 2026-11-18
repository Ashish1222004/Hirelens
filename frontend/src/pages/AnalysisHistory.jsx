
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const AnalysisHistory = () => {
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
            data.message || "Failed to fetch analysis history"
          );
        }

        setHistory(Array.isArray(data.history) ? data.history : []);

      } catch (err) {
        console.error("History fetch error:", err);
        setError(err.message || "Unable to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading analysis history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-3">
          Analysis History
        </h1>

        <p className="text-gray-500 mb-8">
          View your previously analyzed resumes.
        </p>

        {error && (
          <p className="text-red-600 mb-6">
            {error}
          </p>
        )}

        {!error && history.length === 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <p className="text-gray-500">
              No analyses found. Analyze a resume to get started.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {!error && history.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-2">
                {item.resumeName}
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                Analyzed on{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>

              {[
                ["Matching Skills", item.matchingSkills],
                ["Missing Skills", item.missingSkills],
                ["Suggestions", item.suggestions],
                ["Learning Roadmap", item.learningRoadmap]
              ].map(([title, items]) => (
                <div key={title} className="mb-5">
                  <h3 className="font-semibold mb-2">
                    {title}
                  </h3>

                  {Array.isArray(items) && items.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {items.map((text, index) => (
                        <li key={index}>{text}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No items found.
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AnalysisHistory;
