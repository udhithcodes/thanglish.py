import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '0.75rem',
        fontSize: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '3px solid var(--bg-sage)',
          borderTopColor: 'var(--text-forest)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span>Loading thanglish.py...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
