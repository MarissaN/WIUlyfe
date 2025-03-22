import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { MoreVertical } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = () => {
    setShowDialog(false); // Close dialog
    alert("Logged out successfully!"); // Show logout message
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative">
      {/* Three-dot Menu in the top-right corner */}
      <div className="absolute top-4 right-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="p-2 rounded-full hover:bg-gray-200">
            <MoreVertical size={24} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white shadow-lg rounded-lg p-2">
            <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer">
              Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item className="p-2 hover:bg-gray-100 cursor-pointer">
              Help
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="p-2 hover:bg-red-100 cursor-pointer text-red-500"
              onClick={() => setShowDialog(true)}
            >
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <h1 className="text-3xl font-bold mb-6">Welcome to Home Page</h1>

      {/* Logout Confirmation Dialog */}
      <AlertDialog.Root open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80">
            <AlertDialog.Title className="text-lg font-bold">
              Are you sure you want to log out?
            </AlertDialog.Title>
            <div className="flex justify-end gap-4 mt-4">
              <AlertDialog.Cancel className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400">
                No
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer hover:bg-red-600"
              >
                Yes, Logout
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default Home;
