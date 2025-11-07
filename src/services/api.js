import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api'; // Using 127.0.0.1 instead of localhost to avoid potential DNS issues

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url, config.data || '');
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    if (!navigator.onLine) {
      error.message = 'No internet connection. Please check your network.';
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // You might want to redirect to login here
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      // If there's a response with error data, throw it as an error
      if (error.response) {
        throw {
          ...error,
          message: error.response.data?.message || 'Registration failed',
          response: {
            ...error.response,
            data: error.response.data
          }
        };
      }
      throw error;
    }
  },
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

// Proposals API
export const proposalsAPI = {
  createProposal: (proposalData) => api.post('/proposals', proposalData),
  getProposals: (projectId) => api.get(`/proposals?projectId=${projectId}`),
  updateProposal: (id, status) => api.put(`/proposals/${id}`, { status }),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages?userId=${userId}`),
  sendMessage: (messageData) => api.post('/messages', messageData),
};

export default api;
