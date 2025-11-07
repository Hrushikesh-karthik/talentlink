import React, { useState } from "react";
import { Building, Mail, Edit, ClipboardList, Save, X, FileText } from "lucide-react";

function ClientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const [client, setClient] = useState({
    name: "Hithashree A M",
    companyName: "TechNova Solutions",
    email: "hitha@example.com",
    bio: "Innovative client working with top freelancers to build digital solutions.",
    projectsPosted: 8,
    projectsOngoing: 3,
    projectsCompleted: 5,
    resume: "resume_hithashree.pdf", // new field
    recentProjects: [
      { title: "TalentLink Platform UI" },
      { title: "Chat Integration Module" },
      { title: "Freelancer Proposal System" },
    ],
  });

  const [editData, setEditData] = useState(client);

  const handleEditClick = () => {
    setEditData(client);
    setIsEditing(true);
  };

  const handleSave = () => {
    setClient(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, resume: file.name });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0052CC]">Client Profile</h1>

          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-[#0052CC] text-white px-4 py-2 rounded-lg hover:bg-[#003f9a]"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <>
            {/* Info Section */}
            <div className="space-y-3 text-gray-700 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#0052CC]" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#0052CC]" />
                <span>{client.companyName}</span>
              </div>
              <p className="text-gray-600 mt-2">{client.bio}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[#E8F0FE] rounded-xl py-4">
                <p className="text-2xl font-bold text-[#0052CC]">{client.projectsPosted}</p>
                <p className="text-gray-600 text-sm">Projects Posted</p>
              </div>
              <div className="bg-[#E8F0FE] rounded-xl py-4">
                <p className="text-2xl font-bold text-[#0052CC]">{client.projectsOngoing}</p>
                <p className="text-gray-600 text-sm">Ongoing</p>
              </div>
              <div className="bg-[#E8F0FE] rounded-xl py-4">
                <p className="text-2xl font-bold text-[#0052CC]">{client.projectsCompleted}</p>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>

            {/* Resume Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0052CC]" />
                Resume
              </h2>
              {client.resume ? (
                <div className="mt-3 text-black">
                  <a
                    href="#"
                    className="text-[#0052CC] underline hover:text-[#003f9a]"
                  >
                    {client.resume}
                  </a>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No resume uploaded.</p>
              )}
            </div>

            {/* Recent Projects */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#0052CC]" />
                Recent Projects
              </h2>
              <ul className="mt-4 text-black space-y-3">
                {client.recentProjects.map((project, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition"
                  >
                    {project.title}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Edit Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full text-black border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Company</label>
                <input
                  type="text"
                  value={editData.companyName}
                  onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                  className="w-full border text-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full text-black border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full border text-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                  rows="3"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-gray-600 mb-1">Upload Resume</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border text-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
                {editData.resume && (
                  <p className="mt-2 text-gray-700 text-sm">
                    Current file: <span className="font-medium">{editData.resume}</span>
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ClientProfilePage;
