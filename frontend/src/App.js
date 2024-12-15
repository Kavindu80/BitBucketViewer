import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BitbucketDashboard from './components/BitbucketDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const workspace = localStorage.getItem('bitbucketWorkspace');
  const accessToken = localStorage.getItem('bitbucketToken');

  return workspace && accessToken ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <BitbucketDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

// Wrap App with BrowserRouter in index.js
export default App;