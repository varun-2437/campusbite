import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // If visitor is unauthenticated (Guest), redirect directly to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Store Manager has administrative oversight across all dashboard routes
  if (user.role === 'manager') {
    return children;
  }

  // If logged-in user does not have permission for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If student attempted to access worker/manager dashboard, send to student home
    if (user.role === 'student') {
      return <Navigate to="/" replace />;
    }
    // Workers are locked to their own operational dashboard
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}
