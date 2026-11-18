
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AnalyzeResume from "./pages/AnalyzeResume";
import TailorResume from "./pages/TailorResume";
import AnalysisHistory from "./pages/AnalysisHistory";
import SkillGap from "./pages/SkillGap";

import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<AnalyzeResume />} />
          <Route path="/tailor" element={<TailorResume />} />
          <Route path="/history" element={<AnalysisHistory />} />
          <Route path="/skill-gap" element={<SkillGap />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
