import React, { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { FaUser, FaProjectDiagram, FaEnvelope, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

function ClientDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AppContext);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Redirecting...
      </div>
    );
  }

  // Helper to handle card clicks
  const handleCardClick = (path) => {
    navigate(path, { relative: true });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#0052CC] text-white py-4 shadow-md px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">TalentLink Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">Hi, {user.name || user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-[#1DBF73] hover:bg-[#0E7C4D] px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="flex-grow flex flex-col items-center py-10 px-6">
        <h2 className="text-3xl font-bold text-[#0052CC] mb-8">Client Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {/* Create New Project */}
          <div
            onClick={() => navigate("create-project")}
            className="bg-white border-2 border-dashed border-[#1DBF73] rounded-xl p-6 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center min-h-[180px]"
          >
            <div className="bg-[#1DBF73] bg-opacity-10 p-3 rounded-full mb-3">
              <FaPlus className="text-[#1DBF73] text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-[#222222] text-center">Create New Project</h3>
            <p className="text-[#6B7280] text-sm text-center mt-1">
              Start a new project and find the perfect freelancer
            </p>
          </div>

          {/* My Projects */}
          <div
            onClick={() => handleCardClick("/projects")}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaProjectDiagram className="text-[#1DBF73] text-2xl" />
              <h3 className="text-lg font-semibold text-[#222222]">My Projects</h3>
            </div>
            <p className="text-[#6B7280] text-sm">
              View and manage all your current and past projects.
            </p>
          </div>

          {/* Messages */}
          <div
            onClick={() => handleCardClick("/messages")}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaEnvelope className="text-[#1DBF73] text-2xl" />
              <h3 className="text-lg font-semibold text-[#222222]">Messages</h3>
            </div>
            <p className="text-[#6B7280] text-sm">
              Chat with freelancers and manage your communications.
            </p>
          </div>

          {/* Profile */}
          <div
            onClick={() => handleCardClick("/profile")}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FaUser className="text-[#1DBF73] text-2xl" />
              <h3 className="text-lg font-semibold text-[#222222]">Profile</h3>
            </div>
            <p className="text-[#6B7280] text-sm">
              Update your profile details and account settings.
            </p>
          </div>
        </div>
      </main>
      
      {/* This will render the nested routes */}
      <Outlet />
    </div>
  );
}

export default ClientDashboardPage;
