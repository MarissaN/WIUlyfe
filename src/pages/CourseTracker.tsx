import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Subject {
  id: number;
  name: string;
  description: string;
  credits: number;
  instructor: string;
  videoUrl: string;
  grade?: string;
}

const MAX_CREDITS = 33;

const CourseTracker = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]); // Storing subjects for the available courses
  const [semester, setSemester] = useState<string>("Spring 2025");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null); // Subject for modal
  const [registered, setRegistered] = useState<Subject[]>([]); // Registered subjects (current semester)
  const [activities, setActivities] = useState<string[]>([]); // Tracking activities
  const [showAdvanced, setShowAdvanced] = useState(false); // Toggle for advanced view
  const [completed, setCompleted] = useState<Subject[]>([]); // Completed subjects (Fall 2024)

  useEffect(() => {
    const fetchUserCourse = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        console.error("No email found. Redirecting...");
        navigate("/login");
        return;
      }

      try {
        const res = await api.get(`/courses/${email}`);
        setSubjects(res.data); // Fetching subjects of the registered course

        // Adding subjects for Fall 2024 (Completed Subjects)
        if (semester === "Fall 2024") {
          const dummySubjects: Subject[] = [
            {
              id: 1,
              name: "CS101 - Introduction to Computer Science",
              description:
                "A foundational course covering the basics of computer science.",
              credits: 3,
              instructor: "Dr. John Doe",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              grade: "A",
            },
            {
              id: 2,
              name: "CS201 - Data Structures and Algorithms",
              description:
                "Learn about data structures and algorithms in computer science.",
              credits: 4,
              instructor: "Dr. Jane Smith",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              grade: "B",
            },
            {
              id: 3,
              name: "CS301 - Operating Systems",
              description:
                "Introduction to the basics of operating systems and their functions.",
              credits: 3,
              instructor: "Dr. Sarah Lee",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              grade: "A",
            },
          ];
          setCompleted(dummySubjects);
        }

        const storedRegistered = localStorage.getItem(
          "spring2025RegisteredSubjects"
        );
        if (storedRegistered) {
          setRegistered(JSON.parse(storedRegistered));
        }
      } catch (err) {
        console.error("Error fetching course subjects", err);
      }
    };

    fetchUserCourse();
  }, [navigate, semester]);

  // Calculate the total credits for registered subjects
  const totalCredits = registered.reduce(
    (sum, subject) => sum + subject.credits,
    0
  );

  const handleAdd = async (subject: Subject) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!email || !token) {
      navigate("/login");
      return;
    }

    if (totalCredits + subject.credits > MAX_CREDITS) {
      toast.error("🚫 Credit limit exceeded (Max: 33)");
      return;
    }

    try {
      // Register course and update the states
      const res = await api.post(`/register-course`, {
        email,
        name: subject.name,
        semester,
        grade: "",
      });
      setRegistered((prev) => [
        ...prev,
        {
          id: subject.id,
          name: subject.name,
          description: subject.description,
          credits: subject.credits,
          instructor: subject.instructor,
          videoUrl: subject.videoUrl,
        },
      ]); // Add subject to registered
      setSubjects((prev) => prev.filter((s) => s.id !== subject.id)); // Remove from available subjects
      setActivities((prev) => [
        `✅ Registered for ${subject.name} (${semester})`,
        ...prev,
      ]);
      toast.success(`Registered for ${subject.name}`);

      // Save updated registered subjects to localStorage
      localStorage.setItem(
        "spring2025RegisteredSubjects",
        JSON.stringify([
          ...registered,
          {
            id: subject.id,
            name: subject.name,
            description: subject.description,
            credits: subject.credits,
            instructor: subject.instructor,
            videoUrl: subject.videoUrl,
          },
        ])
      );
    } catch (err) {
      console.error("Error adding subject", err);
      toast.error("Failed to register subject.");
    }
  };

  const handleView = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleSemesterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSemester(event.target.value);
  };

  // Toggle view between basic and advanced
  const toggleAdvancedView = () => {
    setShowAdvanced((prev) => !prev);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Course Tracker</h2>

      {/* Semester Dropdown */}
      <div className="mb-4">
        <label className="font-medium">Choose Semester: </label>
        <select
          value={semester}
          onChange={handleSemesterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="Spring 2025">Spring 2025</option>
          <option value="Fall 2024">Fall 2024</option>{" "}
          {/* Filtered options for Spring 2025 and Fall 2024 */}
        </select>
      </div>

      {/* Toggle for Advanced View */}
      {semester === "Fall 2024" && (
        <div className="mb-4 flex items-center">
          <label className="font-medium">Advanced View: </label>
          <input
            type="checkbox"
            checked={showAdvanced}
            onChange={toggleAdvancedView}
            className="ml-2"
          />
        </div>
      )}

      {/* Completed Subjects Table for Fall 2024 */}
      {semester === "Fall 2024" && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Completed Subjects</h3>
          <table className="w-full table-auto border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Subject Name</th>
                <th className="p-2 border">Instructor</th>
                <th className="p-2 border">Credits</th>
                {showAdvanced && <th className="p-2 border">Grade</th>}{" "}
                {/* Show Grade in Advanced View */}
              </tr>
            </thead>
            <tbody>
              {completed.map((subject) => (
                <tr key={subject.id}>
                  <td className="p-2 border">{subject.name}</td>
                  <td className="p-2 border">{subject.instructor}</td>
                  <td className="p-2 border">{subject.credits}</td>
                  {showAdvanced && (
                    <td className="p-2 border">{subject.grade}</td>
                  )}{" "}
                  {/* Show grade in advanced view */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show Available Subjects Table only for Spring 2025 */}
      {semester === "Spring 2025" && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Available Subjects</h3>
          <table className="w-full table-auto border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Subject Name</th>
                <th className="p-2 border">Instructor</th>
                <th className="p-2 border">Credits</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="p-2 border">{subject.name}</td>
                  <td className="p-2 border">{subject.instructor}</td>
                  <td className="p-2 border">{subject.credits}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleAdd(subject)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => handleView(subject)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Registered Subjects Table for Spring 2025 */}
      {semester === "Spring 2025" && (
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Registered Subjects</h3>
          <table className="w-full table-auto border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Subject Name</th>
                <th className="p-2 border">Instructor</th>
                <th className="p-2 border">Credits</th>
                {/* Action column for Spring 2025 */}
              </tr>
            </thead>
            <tbody>
              {registered.map((subject) => (
                <tr key={subject.id}>
                  <td className="p-2 border">{subject.name}</td>
                  <td className="p-2 border">{subject.instructor}</td>
                  <td className="p-2 border">{subject.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Subject Details */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <h3 className="text-xl font-bold mb-2">{selectedSubject.name}</h3>
            <p className="mb-2">{selectedSubject.description}</p>
            <p className="text-sm mb-2">
              Instructor: {selectedSubject.instructor}
            </p>
            <p className="text-sm mb-4">Credits: {selectedSubject.credits}</p>
            {selectedSubject.videoUrl ? (
              <iframe
                className="w-full h-64"
                src={selectedSubject.videoUrl.replace("watch?v=", "embed/")}
                title={selectedSubject.name}
                allowFullScreen
              ></iframe>
            ) : (
              <p>No video available</p>
            )}
            <div className="text-right mt-4">
              <button
                onClick={() => setSelectedSubject(null)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CourseTracker;
