import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CourseTracker from "./pages/CourseTracker";
import FinancialTracker from "./pages/FinancialTracker";
import AuthenticatedLayout from "./pages/AuthenticatedLayout";

function App() {
  return (
    <Routes>
      {/* Public routes (no sidebar) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Authenticated routes (with sidebar) */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/course-tracker" element={<CourseTracker />} />
        <Route path="/financial-tracker" element={<FinancialTracker />} />
      </Route>
    </Routes>
  );
}

export default App;
