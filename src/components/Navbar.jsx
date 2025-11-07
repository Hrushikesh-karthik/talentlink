import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function Navbar() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#FFFFFF] shadow-sm border-b border-[#6B7280]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-[#0052CC]">
              TalentLink
            </Link>
          </div>

          {/* Right Side: Navigation */}
          <div className="flex items-center space-x-4">
            {!user ? (
              /* Not Logged In */
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-[#222222] bg-[#F3F4F6] border border-[#6B7280]/30 hover:bg-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[#1DBF73] hover:bg-[#0E7C4D]"
                >
                  Register
                </Link>
              </>
            ) : (
              /* Logged In */
              <div className="flex items-center space-x-4">
                {user.role === 'client' && (
                  <Link
                    to="/client"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0052CC]"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'freelancer' && (
                  <Link
                    to="/freelancer"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#0052CC]"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium text-[#222222] bg-[#F3F4F6] border border-[#6B7280]/30 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
