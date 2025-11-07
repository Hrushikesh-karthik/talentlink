import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle, FaDollarSign, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '../services/api';

function FreelancerProjects() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAcceptedProposals = async () => {
      try {
        setLoading(true);
        console.log('Fetching accepted proposals...');
        const response = await api.get('/proposals/accepted');
        console.log('API Response:', response.data);
        setProposals(response.data);
      } catch (err) {
        console.error('Error fetching accepted proposals:', err);
        setError('Failed to load accepted proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedProposals();
  }, []);

  const getStatusBadge = (proposalStatus, projectStatus) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'accepted': 'bg-green-100 text-green-800 border border-green-200',
      'rejected': 'bg-red-100 text-red-800 border border-red-200',
      'in_progress': 'bg-blue-100 text-blue-800 border border-blue-200',
      'completed': 'bg-purple-100 text-purple-800 border border-purple-200'
    };

    // Use project status if proposal is accepted, otherwise use proposal status
    const statusToShow = proposalStatus === 'accepted' ? projectStatus : proposalStatus;
    
    return (
      <div className="flex flex-col space-y-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[statusToShow] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
          {statusToShow.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
        {proposalStatus === 'accepted' && (
          <span className="text-xs text-gray-500">Proposal: Accepted</span>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-[#1DBF73]" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    if (proposals.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500">
          <FaCheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No accepted proposals</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your accepted proposals will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-200">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="p-4 hover:bg-gray-50">
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-start sm:items-center flex-col sm:flex-row">
                  <h3 className="text-lg font-medium text-gray-900">
                    {proposal.project_title}
                  </h3>
                  <div className="mt-1 sm:mt-0 sm:ml-2">
                    {getStatusBadge(proposal.proposal_status, proposal.project_status)}
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex space-x-2">
                  <button
                    onClick={() => window.location.href = `/projects/${proposal.project_id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-[#1DBF73] hover:bg-[#0E7C4D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DBF73]"
                  >
                    View Project
                  </button>
                  <button
                    onClick={() => window.location.href = `/messages?user=${proposal.client_id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DBF73]"
                  >
                    Message Client
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Your Proposal:</p>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {proposal.cover_letter}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaUser className="mr-1 text-gray-400" />
                  <span>Client: {proposal.client_name}</span>
                </div>
                <div className="flex items-center">
                  <FaDollarSign className="mr-1 text-gray-400" />
                  <span>Bid: ${parseFloat(proposal.bid_amount).toFixed(2)}</span>
                </div>
                {proposal.deadline && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-gray-400" />
                    <span>Deadline: {formatDate(proposal.deadline)}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1 text-gray-400" />
                  <span>Proposed on: {formatDate(proposal.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          My Proposals
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          All your project proposals and their current status
        </p>
      </div>
      {renderContent()}
    </div>
  );
}

export default FreelancerProjects;
