import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [workspace, setWorkspace] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!workspace || !accessToken) {
      setError('Please enter both workspace and access token');
      return;
    }

    try {
      // Validate credentials by making a test API call
      const response = await fetch(`http://localhost:4000/api/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspace, accessToken })
      });

      const data = await response.json();

      if (response.ok) {
        // Store credentials securely
        localStorage.setItem('bitbucketWorkspace', workspace);
        localStorage.setItem('bitbucketToken', accessToken);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Bitbucket Dashboard
          </h2>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label htmlFor="workspace" className="block text-gray-700 font-semibold mb-2">
              Bitbucket Workspace
            </label>
            <input
              type="text"
              id="workspace"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder="Enter your Bitbucket workspace"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          <div>
            <label htmlFor="accessToken" className="block text-gray-700 font-semibold mb-2">
              Access Token
            </label>
            <input
              type="password"
              id="accessToken"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Enter your Bitbucket access token"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
          >
            <span>Login</span>
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Need an Access Token?</p>
            <a 
              href="https://bitbucket.org/account/settings/app-passwords/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Create Bitbucket App Password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;