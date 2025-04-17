import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { UserCircle } from "lucide-react";
import MentalHealthPopup from "./MentalHealthPopup";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-white min-h-screen p-4 relative">
        {/* Profile Dropdown in Top-Right */}
        <div className="absolute top-4 right-6 z-50">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="focus:outline-none">
                <UserCircle
                  size={32}
                  className="text-gray-700 hover:text-blue-600"
                />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="bg-white shadow-lg rounded-lg p-2 w-40">
              <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer">
                Settings
              </DropdownMenu.Item>
              <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer">
                Help
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="p-2 hover:bg-red-100 text-red-600 cursor-pointer"
                onClick={() => setShowLogoutDialog(true)}
              >
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Main Page Content */}
        <Outlet />

        {/* Mental Health Popup → Visible on all pages except Login & Signup */}
        {pathname !== "/" && pathname !== "/signup" && <MentalHealthPopup />}

        {/* Logout Confirmation Dialog */}
        <AlertDialog.Root
          open={showLogoutDialog}
          onOpenChange={setShowLogoutDialog}
        >
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 z-50" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
              <AlertDialog.Title className="text-lg font-bold mb-4">
                Are you sure you want to log out?
              </AlertDialog.Title>
              <div className="flex justify-end gap-4">
                <AlertDialog.Cancel className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes, Logout
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
