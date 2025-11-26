// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner" style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: 'var(--text-color)'
      }}>
        Checking permissions...
      </div>
    );
  }

  console.log('AdminRoute - User:', user, 'Is Admin:', isAdmin); // Debug log

  // User must be logged in AND have admin role
  return user && isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;