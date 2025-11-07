import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import api from "../services/api";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const categories = [
    "Web Development",
    "Mobile App",
    "Design & Creative",
    "Writing & Translation",
    "Digital Marketing",
    "Business",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    if (!user) {
      setMessage({ text: "You must be logged in to create a project", type: "error" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Format the data for the API
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline || undefined
      };
      
      console.log("Sending project data:", JSON.stringify(projectData, null, 2));
      
      // Get token for debugging
      const token = localStorage.getItem('token');
      console.log('Auth token:', token ? 'Token exists' : 'No token found');
      
      // Make the API request with headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      console.log('Sending request to /api/projects with config:', config);
      
      // Use the API service to create the project
      const response = await api.post("/projects", projectData, config);
      
      console.log("Project created successfully:", response.data);
      
      setMessage({ 
        text: "🎉 Project created successfully! Redirecting...", 
        type: "success" 
      });
      
      // Redirect to client dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/client");
      }, 1500);
      
    } catch (error) {
      console.error("Error creating project:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: error.config
      });
      
      let errorMsg = "Failed to create project. Please check the form and try again.";
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = "Your session has expired. Please log in again.";
        } else if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        } else if (error.response.data?.message) {
          errorMsg = error.response.data.message;
        }
      } else if (error.request) {
        errorMsg = "No response from server. Please check your connection.";
      }
      
      setMessage({ 
        text: `Error: ${errorMsg}`,
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#0052CC] hover:text-[#003d99] mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create a New Project</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to post your project and find the perfect freelancer.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          {message.text && (
            <div 
              className={`mb-6 p-4 rounded-md ${
                message.type === "error" 
                  ? "bg-red-50 text-red-700" 
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Build a responsive e-commerce website"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0052CC] focus:border-[#0052CC] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Project Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Provide a detailed description of your project, including goals, requirements, and any specific technologies or skills needed."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0052CC] focus:border-[#0052CC] sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0052CC] focus:border-[#0052CC] sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget (₹) *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    min="0"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 10000"
                    className="pl-7 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-[#0052CC] focus:border-[#0052CC] sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0052CC] focus:border-[#0052CC] sm:text-sm"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052CC]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#1DBF73] hover:bg-[#0E7C4D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DBF73] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Creating...'
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
