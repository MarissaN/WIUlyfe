import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  id: number;
  name: string;
  semester: string;
  grade: string;
  userId: number;
  credits?: number;
  instructor?: string;
}

const allCourses = [
  {
    name: "Artificial Intelligence",
    description: "Study of intelligent agents and ML algorithms.",
    videoUrl: "https://www.youtube.com/watch?v=ad79nYk2keg",
    credits: 3,
    instructor: "Dr. Alan Turing",
  },
  {
    name: "Software Engineering",
    description: "Applying engineering principles to software.",
    videoUrl: "https://www.youtube.com/watch?v=2naWCkCJx_E",
    credits: 4,
    instructor: "Prof. Ada Lovelace",
  },
  {
    name: "Data Warehouse",
    description: "Warehousing data and analytical techniques.",
    videoUrl: "https://www.youtube.com/watch?v=2naWCkCJx_E",
    credits: 4,
    instructor: "Prof. Ada Lovelace",
  },
  {
    name: "Operating Systems",
    description: "Managing hardware and software resources.",
    videoUrl: "https://www.youtube.com/watch?v=ZjKzd7wlNdU",
    credits: 4,
    instructor: "Dr. Linus Torvalds",
  },
];

const getCurrentSemester = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  if (month <= 5) return `Spring ${year}`;
  if (month <= 8) return `Summer ${year}`;
  return `Fall ${year}`;
};

const CourseTracker = () => {
  const email = "student1@wiu.edu";
  const [registered, setRegistered] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [semester, setSemester] = useState(getCurrentSemester());
  const [error, setError] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5050/courses/${email}`)
      .then((res) => setRegistered(res.data))
      .catch((err) => console.error("Error fetching courses", err));
  }, []);

  const isPastSemester = (sem: string) => {
    const [season, yearStr] = sem.split(" ");
    const year = parseInt(yearStr, 10);
    const today = new Date();
    const semEnd =
      season === "Spring"
        ? new Date(year, 4, 31)
        : season === "Summer"
        ? new Date(year, 7, 31)
        : new Date(year, 11, 31);
    return today > semEnd;
  };

  const currentSemester = getCurrentSemester();
  const isCurrent = semester === currentSemester;
  const completedCourses = registered.filter(
    (c) => isPastSemester(c.semester) && c.semester === semester
  );
  const currentCourses = registered.filter((c) => c.semester === semester);
  const previouslyCompletedNames = registered
    .filter((c) => isPastSemester(c.semester))
    .map((c) => c.name);

  const available = allCourses.filter(
    (course) => !registered.some((c) => c.name === course.name)
  );

  const handleAdd = async (course: (typeof allCourses)[0]) => {
    if (isPastSemester(semester)) {
      setError("❌ Cannot register courses for past semesters.");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5050/register-course`, {
        email,
        name: course.name,
        semester,
        grade: "",
        credits: course.credits,
        instructor: course.instructor,
      });
      setRegistered((prev) => [...prev, res.data]);
      setActivities((prev) => [
        `✅ Registered for ${course.name} (${semester})`,
        ...prev,
      ]);
      setError("");
    } catch (err) {
      console.error("Error adding course", err);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      await axios.delete(`http://localhost:5050/courses/${id}`);
      setRegistered((prev) => prev.filter((c) => c.id !== id));
      setActivities((prev) => [`❌ Removed ${name} from ${semester}`, ...prev]);
    } catch (err) {
      console.error("Error deleting course", err);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">📚 Course Tracker</h2>

        <label className="block mb-2 font-medium">Select Semester:</label>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border px-3 py-2 rounded mb-4"
        >
          {[
            getCurrentSemester(),
            "Spring 2024",
            "Fall 2024",
            "Spring 2025",
            "Fall 2025",
          ]
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
        </select>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isCurrent && (
          <>
            {/* Available Courses */}
            <h3 className="text-lg font-semibold mb-2">Available Subjects</h3>
            <table className="w-full border mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Course</th>
                  <th className="p-2 border">Info</th>
                  <th className="p-2 border">Add</th>
                </tr>
              </thead>
              <tbody>
                {available.map((course) => (
                  <tr key={course.name}>
                    <td className="p-2 border">{course.name}</td>
                    <td className="p-2 border text-center">
                      <button
                        className="text-blue-600 underline text-sm"
                        onClick={() => setSelectedCourse(course)}
                      >
                        View
                      </button>
                    </td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleAdd(course)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Registered Courses */}
            <h3 className="text-lg font-semibold mb-2">
              Registered Courses for {semester}:
            </h3>
            {currentCourses.length === 0 ? (
              <p>No courses registered.</p>
            ) : (
              <ul className="space-y-2 mb-8">
                {currentCourses.map((course) => (
                  <li
                    key={course.id}
                    className="border p-3 rounded flex justify-between"
                  >
                    <div>
                      <strong>{course.name}</strong>
                    </div>
                    <button
                      onClick={() => handleDelete(course.id, course.name)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {!isCurrent && (
          <>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                Completed Courses for {semester}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {showAdvanced ? "Advanced View" : "Basic View"}
                </span>
                <input
                  type="checkbox"
                  checked={showAdvanced}
                  onChange={() => setShowAdvanced(!showAdvanced)}
                  className="w-5 h-5"
                />
              </div>
            </div>
            {completedCourses.length === 0 ? (
              <p>No courses completed in this semester.</p>
            ) : (
              <ul className="space-y-2 mb-8">
                {completedCourses.map((course) => (
                  <li
                    key={course.id}
                    className="border p-3 rounded flex justify-between"
                  >
                    <div>
                      <strong>{course.name}</strong>{" "}
                      {showAdvanced && `(Grade: ${course.grade || "N/A"})`}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Sidebar Activities */}
      <div className="w-80 bg-gray-100 border-l p-4 overflow-y-auto max-h-screen sticky top-0">
        <h3 className="text-lg font-bold mb-2">Recent Activities</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          {activities.length === 0 ? (
            <li>No recent actions yet.</li>
          ) : (
            activities.map((act, i) => <li key={i}>{act}</li>)
          )}
        </ul>
      </div>

      {/* Course Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <h3 className="text-xl font-bold mb-2">{selectedCourse.name}</h3>
            <p className="mb-2">{selectedCourse.description}</p>
            <p className="text-sm mb-2">
              Instructor: {selectedCourse.instructor}
            </p>
            <p className="text-sm mb-4">Credits: {selectedCourse.credits}</p>
            <iframe
              className="w-full h-64"
              src={selectedCourse.videoUrl.replace("watch?v=", "embed/")}
              title={selectedCourse.name}
              allowFullScreen
            ></iframe>
            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTracker;
