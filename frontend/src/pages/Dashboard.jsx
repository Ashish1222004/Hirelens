
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (response.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load user details");
        }

        const data = await response.json();
        setUser(data.user);

      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError("Unable to load your account details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      navigate("/login", { replace: true });

    } catch (error) {
      console.error("Logout error:", error);
      setError("Unable to log out. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          HireLens
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        <h2 className="text-3xl font-bold mb-3">
          Welcome back, {user?.name || "User"}!
        </h2>

        <p className="text-gray-500 mb-10">
          Your AI-powered career dashboard
        </p>

        {error && (
          <p className="text-red-600 mb-6">
            {error}
          </p>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Analyze Resume */}
          <button
            type="button"
            onClick={() => navigate("/analyze")}
            className="text-left bg-white p-7 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              Analyze Resume
            </h3>

            <p className="text-gray-500">
              Upload your resume and compare it with a job description.
            </p>
          </button>

          {/* Tailor Resume */}
          <button
            type="button"
            onClick={() => navigate("/tailor")}
            className="text-left bg-white p-7 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              Tailor Resume
            </h3>

            <p className="text-gray-500">
              Generate an AI-tailored LaTeX resume for any job.
            </p>
          </button>

          {/* Skill Gap Analysis */}
          <button
            type="button"
            onClick={() => navigate("/skill-gap")}
            className="text-left bg-white p-7 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              Skill Gap Analysis
            </h3>

            <p className="text-gray-500">
              Discover your most frequently missing skills
              across previous resume analyses.
            </p>
          </button>

          {/* Analysis History */}
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="text-left bg-white p-7 rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-3">
              Analysis History
            </h3>

            <p className="text-gray-500">
              View your previous resume analyses and recommendations.
            </p>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
