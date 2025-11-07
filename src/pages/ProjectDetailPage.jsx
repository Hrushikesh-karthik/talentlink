import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  X, 
  MessageSquare, 
  User, 
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [projectRes, proposalsRes] = await Promise.all([
          api.get(`/projects/${id}`).catch(err => {
            console.error('Error fetching project:', err);
            throw new Error('Failed to load project details');
          }),
          api.get(`/projects/${id}/proposals`).catch(err => {
            console.error('Error fetching proposals:', err);
            // Continue even if proposals fail, we'll show an empty state
            return { data: [] };
          })
        ]);
        
        if (isMounted) {
          setProject(projectRes.data);
          setProposals(proposalsRes.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load project details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProject();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  const [isProcessing, setIsProcessing] = useState({});

  const handleProposalAction = async (proposalId, action) => {
    try {
      setIsProcessing(prev => ({ ...prev, [proposalId]: true }));
      
      // Remove the leading /api/ since the base URL already includes it
      const response = await api.put(`/proposals/${proposalId}`, { status: action });
      
      // Update the UI optimistically
      setProposals(prevProposals => 
        prevProposals.map(proposal => {
          if (proposal.id === proposalId) {
            return { ...proposal, status: action };
          }
          // If accepting, reject all other proposals for this project
          if (action === 'accepted' && proposal.status === 'pending') {
            return { ...proposal, status: 'rejected' };
          }
          return proposal;
        })
      );
      
      // Update project status if accepting a proposal
      if (action === 'accepted') {
        setProject(prev => ({
          ...prev,
          status: 'in_progress',
          status_display: 'In Progress'
        }));
      }
      
      // Show success message
      alert(`Proposal ${action} successfully`);
      
    } catch (err) {
      console.error('Error updating proposal:', err);
      alert(err.response?.data?.error || 'Failed to update proposal');
      
      // Refresh data on error to ensure consistency
      try {
        const [projectRes, proposalsRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/projects/${id}/proposals`)
        ]);
        setProject(projectRes.data);
        setProposals(proposalsRes.data || []);
      } catch (refreshErr) {
        console.error('Error refreshing data:', refreshErr);
      }
    } finally {
      setIsProcessing(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1DBF73] mb-4"></div>
        <p className="text-gray-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading project</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-700 font-medium hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center p-8">Project not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#1DBF73] mb-6 hover:underline"
      >
        <ArrowLeft className="mr-2" /> Back to Projects
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'open' ? 'bg-green-100 text-green-800' :
                project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          </div>
          <div className="text-xl font-semibold text-gray-800">
            ${project.budget?.toLocaleString()}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">{project.description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            <span>Client: {project.client_name || 'Unknown'}</span>
          </div>
          {project.deadline && (
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Proposals ({proposals.length})
          </h2>
        </div>
        
        {proposals.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No proposals yet</h3>
            <p className="mt-1 text-gray-500 max-w-md mx-auto">
              You haven't received any proposals for this project yet. Check back later or share your project to attract freelancers.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className={`border rounded-lg p-4 transition-all ${
                  proposal.status === 'accepted' 
                    ? 'border-green-200 bg-green-50' 
                    : proposal.status === 'rejected'
                    ? 'border-red-100 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">
                        {proposal.freelancer_name}
                      </div>
                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => handleProposalAction(proposal.id, 'accepted')}
                        disabled={proposal.status !== 'pending' || isProcessing[proposal.id]}
                        className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium ${
                          proposal.status === 'accepted'
                            ? 'bg-green-100 text-green-800 cursor-default'
                            : proposal.status === 'pending'
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isProcessing[proposal.id] ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Check className="mr-1.5 h-4 w-4" />
                            {proposal.status === 'accepted' ? 'Accepted' : 'Accept'}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleProposalAction(proposal.id, 'rejected')}
                        disabled={proposal.status !== 'pending' || isProcessing[proposal.id]}
                        className={`px-3 py-1.5 rounded-md flex items-center text-sm font-medium ${
                          proposal.status === 'rejected'
                            ? 'bg-red-100 text-red-800 cursor-default'
                            : proposal.status === 'pending'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <X className="mr-1.5 h-4 w-4" />
                        {proposal.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </button>
                      <button
                        onClick={() => navigate(`/messages?user=${proposal.freelancer_id}`)}
                        disabled={isProcessing[proposal.id]}
                        className={`p-1.5 rounded-full ${
                          isProcessing[proposal.id]
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Message freelancer"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  {proposal.cover_letter}
                </div>
                    </div>
                  </div>
                )}
                
                {proposal.status === 'rejected' && (
                  <div className="mt-3 pt-3 border-t border-red-100">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      ✗ Rejected
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
