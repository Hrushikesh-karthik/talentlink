import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaProjectDiagram, FaEnvelope, FaSignOutAlt, FaSearch, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import ProjectProposalForm from "../components/ProjectProposalForm";
import FreelancerProjects from "../components/FreelancerProjects";
import api from "../services/api";

function FreelancerDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'accepted'

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchAvailableProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/projects/available');
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAvailableProjects();
    }
  }, [user]);

  const handlePropose = (project) => {
    setSelectedProject(project);
    setShowProposalForm(true);
  };

  const handleProposalSubmit = () => {
    setShowProposalForm(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      <nav className="bg-[#0052CC] text-white py-4 shadow-md px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">TalentLink Freelancer Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium">Welcome, {user.name || user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-[#1DBF73] hover:bg-[#0E7C4D] px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`${activeTab === 'available' ? 'border-[#1DBF73] text-[#1DBF73]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Available Projects
              </button>
              <button
                onClick={() => setActiveTab('accepted')}
                className={`${activeTab === 'accepted' ? 'border-[#1DBF73] text-[#1DBF73]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Accepted Projects
              </button>
            </nav>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              {activeTab === 'available' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {loading ? (
                    <div className="col-span-full flex justify-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-[#1DBF73]" />
                    </div>
                  ) : projects.length > 0 ? (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {project.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">
                              ${project.budget}
                            </span>
                            <button
                              onClick={() => handlePropose(project)}
                              className="px-4 py-2 bg-[#1DBF73] text-white text-sm font-medium rounded-md hover:bg-[#0E7C4D] transition"
                            >
                              Submit Proposal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No projects available</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        There are currently no projects available. Check back later!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <FreelancerProjects />
              )}
            </div>

            {/* Quick Actions */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUser className="text-blue-600" />
                    </div>
                    <span>View/Edit Profile</span>
                  </button>
                  <button
                    onClick={() => navigate("/messages")}
                    className="w-full bg-white p-4 rounded-lg border border-gray-200 flex items-center space-x-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaEnvelope className="text-green-600" />
                    </div>
                    <span>Messages</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Proposal Form Modal */}
        {showProposalForm && selectedProject && (
          <ProjectProposalForm
            projectId={selectedProject.id}
            onClose={() => setShowProposalForm(false)}
            onProposalSubmit={() => {
              // Refresh the projects list after successful submission
              const fetchAvailableProjects = async () => {
                try {
                  const response = await api.get('/projects/available');
                  setProjects(response.data);
                } catch (err) {
                  console.error('Error refreshing projects:', err);
                }
              };
              fetchAvailableProjects();
            }}
          />
        )}
      </main>
    </div>
  );
}

export default FreelancerDashboardPage;
