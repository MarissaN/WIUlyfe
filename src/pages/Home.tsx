import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface Course {
  id: number;
  name: string;
  semester: string;
  grade: string;
  userId: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        if (!email || !token) {
          console.error("No email/token found. Redirecting...");
          navigate("/login");
          return;
        }

        const res = await api.get(`/courses/${email}`, token);
        setRegistered(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };

    fetchCourses();
  }, [navigate]);

  const semesterCounts = registered.reduce(
    (acc: Record<string, number>, course) => {
      acc[course.semester] = (acc[course.semester] || 0) + 1;
      return acc;
    },
    {}
  );

  const courseData = {
    labels: Object.keys(semesterCounts),
    datasets: [
      {
        label: "Subjects Registered",
        data: Object.values(semesterCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8B5CF6",
          "#34D399",
        ],
      },
    ],
  };

  const financialData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Expenses ($)",
        data: [20, 35, 50, 25, 40, 60, 30],
        backgroundColor: "#FBBF24",
      },
    ],
  };

  const healthData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Water Intake (glasses)",
        data: [7, 8, 6, 9, 10, 5, 8],
        backgroundColor: "#60A5FA",
      },
      {
        label: "Gym Minutes",
        data: [40, 60, 0, 45, 30, 70, 0],
        backgroundColor: "#F472B6",
      },
    ],
  };

  const plannerData = {
    labels: ["Daily", "Weekly", "Monthly"],
    datasets: [
      {
        label: "Tasks Created",
        data: [5, 3, 2],
        backgroundColor: ["#4ADE80", "#34D399", "#22C55E"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-10">
        Welcome to Home Page
      </h1>

      {/* Row 1: Course + Financial */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* 📚 Course Tracker */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            📊 Course Tracker Dashboard
          </h2>
          {registered.length === 0 ? (
            <p>No registered courses yet.</p>
          ) : (
            <Pie data={courseData} />
          )}
          <button
            onClick={() => navigate("/course-tracker")}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Course Tracker
          </button>
        </div>

        {/*  Financial Tracker */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            💰 Financial Tracker Dashboard
          </h2>
          <Bar data={financialData} />
          <button
            onClick={() => navigate("/financial-tracker")}
            className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Go to Financial Tracker
          </button>
        </div>
      </div>

      {/* Row 2: Health Tracker */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto text-center mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          📈 Health Tracker Dashboard
        </h2>
        <Bar data={healthData} />
        <button
          onClick={() => navigate("/health-tracker")}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Go to Health Tracker
        </button>
      </div>

      {/* Row 3: Curriculum Planner */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">
          📘 Curriculum Planner Dashboard
        </h2>
        <Bar data={plannerData} />
        <button
          onClick={() => navigate("/curriculum-planner")}
          className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Go to Curriculum Planner
        </button>
      </div>
    </div>
  );
};

export default Home;
