import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Course Tracker", path: "/course-tracker" },
    { name: "Financial Tracker", path: "/financial-tracker" },
    { name: "Curriculum Planner", path: "/curriculum-planner" },
    { name: "Health Tracker", path: "/health-tracker" },
  ];

  return (
    <div className="flex">
      {/* Toggle Button */}
      <button
        className="p-3 m-2 fixed top-2 left-2 z-50 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      {open && (
        <div className="w-64 bg-gray-100 h-screen p-4 pt-12 shadow-md fixed top-0 left-0 z-40">
          <h2 className="text-xl font-bold mb-6">📘 Wiulyfe</h2>
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-2 rounded hover:bg-gray-200 ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white"
                    : "text-gray-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Push content if sidebar open */}
      <div className={`${open ? "ml-64" : "ml-0"} transition-all w-full`}>
        {/* children or routed page will be rendered here via AuthenticatedLayout */}
      </div>
    </div>
  );
};

export default Sidebar;
