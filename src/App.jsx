import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import { useContext } from 'react';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProjectListPage from './pages/ProjectListPage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import CreateProjectPage from './pages/CreateProjectPage.jsx';
import ClientDashboardPage from './pages/ClientDashboardPage.jsx';
import FreelancerDashboardPage from './pages/FreelancerDashboardPage.jsx';
import MessagesPage from './pages/MessagePage.jsx';
import ProfilePage from './pages/profilePage.jsx';
import FreelancerMessagePage from "./pages/freelancerMessage.jsx";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useContext(AppContext);
  
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public Routes without Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Freelancer Routes */}
          <Route 
            path="freelancer" 
            element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerDashboardPage />
              </ProtectedRoute>
            } 
          >
            <Route index element={<FreelancerDashboardPage />} />
            <Route path="messages" element={<FreelancerMessagePage />} />
          </Route>
          
          <Route 
            path="projects" 
            element={
              <ProtectedRoute>
                <ProjectListPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="project/:id" 
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Client Routes */}
          <Route 
            path="client" 
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboardPage />
              </ProtectedRoute>
            }
          >
            <Route index element={null} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="create-project" element={<CreateProjectPage />} />
          </Route>
          
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800">404</h1>
              <p className="text-gray-600 mt-2">Page not found</p>
              <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
                Go back home
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </AppProvider>
  );
}

export default App;