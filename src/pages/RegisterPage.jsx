import React, { useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function RegisterPage() {
  const { register, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({ 
        name, 
        email, 
        password, 
        role 
      });
      
      if (result.success) {
        // Redirect based on role
        navigate(role === 'client' ? '/client-dashboard' : '/freelancer-dashboard');
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F3F4F6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#0052CC]">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-[#6B7280]">
            Join TalentLink as a Client or Freelancer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-[#FFFFFF] p-8 shadow-md rounded-lg">
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="rounded-md shadow-sm space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-[#222222]">I am a:</label>
              <fieldset className="mt-2">
                <legend className="sr-only">User role</legend>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="role-client"
                      name="role"
                      type="radio"
                      value="client"
                      checked={role === "client"}
                      onChange={() => setRole("client")}
                      required
                      className="h-4 w-4 text-[#1DBF73] focus:ring-[#0E7C4D] border-[#6B7280]/50"
                    />
                    <label htmlFor="role-client" className="ml-2 block text-sm text-[#222222]">
                      Client (Hiring)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="role-freelancer"
                      name="role"
                      type="radio"
                      value="freelancer"
                      checked={role === "freelancer"}
                      onChange={() => setRole("freelancer")}
                      required
                      className="h-4 w-4 text-[#1DBF73] focus:ring-[#0E7C4D] border-[#6B7280]/50"
                    />
                    <label htmlFor="role-freelancer" className="ml-2 block text-sm text-[#222222]">
                      Freelancer (Working)
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="relative block w-full appearance-none rounded-md border border-[#6B7280]/50 px-3 py-2 text-[#222222] placeholder-[#6B7280] focus:z-10 focus:border-[#1DBF73] focus:outline-none focus:ring-[#1DBF73] sm:text-sm"
                placeholder="Full Name"
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border border-[#6B7280]/50 px-3 py-2 text-[#222222] placeholder-[#6B7280] focus:z-10 focus:border-[#1DBF73] focus:outline-none focus:ring-[#1DBF73] sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-md border border-[#6B7280]/50 px-3 py-2 text-[#222222] placeholder-[#6B7280] focus:z-10 focus:border-[#1DBF73] focus:outline-none focus:ring-[#1DBF73] sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#1DBF73] py-2 px-4 text-sm font-medium text-white hover:bg-[#0E7C4D] focus:outline-none focus:ring-2 focus:ring-[#0E7C4D] focus:ring-offset-2"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-[#6B7280]">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#00B8D9] hover:text-[#0052CC]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
