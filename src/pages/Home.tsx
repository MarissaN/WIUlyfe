import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const email = "student1@wiu.edu";

  useEffect(() => {
    axios
      .get(`http://localhost:5050/courses/${email}`)
      .then((res) => setRegistered(res.data))
      .catch((err) => console.error("Error fetching courses", err));
  }, []);

  const semesterCounts = registered.reduce(
    (acc: Record<string, number>, course) => {
      acc[course.semester] = (acc[course.semester] || 0) + 1;
      return acc;
    },
    {}
  );

  const data = {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to Home Page</h1>

      {/* Course Tracker Dashboard */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          📊 Course Tracker Dashboard
        </h2>
        {registered.length === 0 ? (
          <p>No registered courses yet.</p>
        ) : (
          <Pie data={data} />
        )}
      </div>

      <button
        onClick={() => navigate("/course-tracker")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Go to Course Tracker
      </button>
    </div>
  );
};

export default Home;
