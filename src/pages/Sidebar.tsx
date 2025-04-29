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
      {/* Sidebar */}
      {open && (
        <div className="w-64 bg-gray-100 h-screen p-4 pt-12 shadow-md fixed top-0 left-0 z-40">
          {/* Close Button on the Right */}
          <button
            className="absolute top-4 right-6 z-50 p-2 text-gray-700 hover:text-gray-900"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>

          {/* Logo */}
          <div className="flex items-center mb-6">
            {/* Corrected path to the image in the public folder */}
            <img src="/images/WIUlyfe.png" className="h-8 mr-2" />
            <h2 className="text-xl font-bold">WIUlyfe</h2>
          </div>

          {/* Navigation Links */}
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

      {/* Main Content */}
      <div className={`${open ? "ml-64" : "ml-0"} transition-all w-full`}>
        {/* children or routed page will be rendered here via AuthenticatedLayout */}
      </div>
    </div>
  );
};

export default Sidebar;
