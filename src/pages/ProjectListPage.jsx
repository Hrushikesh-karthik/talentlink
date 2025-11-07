import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import api from "../services/api";

function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get("/projects/my-projects");
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    } else {
      setLoading(false);
      setError("Please log in to view your projects.");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-[#1DBF73] mb-4" />
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <FaExclamationCircle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Projects</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1DBF73] text-white px-4 py-2 rounded-md hover:bg-[#0E7C4D] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#0052CC]">
            My Projects
          </h1>
          <button
            onClick={() => navigate("/client/create-project")}
            className="bg-[#1DBF73] text-white px-4 py-2 rounded-md hover:bg-[#0E7C4D] transition flex items-center"
          >
            <FaPlus className="mr-2" />
            New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first project</p>
            <button
              onClick={() => navigate("/client/create-project")}
              className="bg-[#1DBF73] text-white px-6 py-2 rounded-md hover:bg-[#0E7C4D] transition"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer hover:border-[#1DBF73]"
              >
                <h2 className="text-xl font-semibold text-[#0052CC] mb-2">
                  {project.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                <div className="text-sm space-y-1 text-gray-700">
                  <p>
                    <span className="font-medium text-gray-800">Status:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "Ongoing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Budget:</span>{" "}
                    {project.budget}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Deadline:</span>{" "}
                    {project.deadline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectListPage;
