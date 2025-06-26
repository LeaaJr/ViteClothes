// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react'; // Import useEffect
import { Navigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading, user } = useAuth(); // Also get 'user' for more context
    const location = useLocation(); // Get current location

    console.log('ProtectedRoute rendering for path:', location.pathname);
    console.log('  loading:', loading);
    console.log('  isAuthenticated:', isAuthenticated);
    console.log('  isAdmin:', isAdmin);
    console.log('  adminOnly (prop):', adminOnly);
    console.log('  User object:', user); // Inspect the full user object

    useEffect(() => {
        console.log('ProtectedRoute useEffect triggered for path:', location.pathname);
        console.log('  (useEffect) loading:', loading);
        console.log('  (useEffect) isAuthenticated:', isAuthenticated);
        console.log('  (useEffect) isAdmin:', isAdmin);
        if (!loading && !isAuthenticated) {
            console.log('  Redirecting to /admin/login because not authenticated.');
        } else if (!loading && adminOnly && !isAdmin) {
            console.log('  Redirecting to / because adminOnly and not an admin.');
        }
    }, [loading, isAuthenticated, isAdmin, adminOnly, location.pathname]);


    // While loading the authentication state
    if (loading) {
        return <div>Loading authentication...</div>; 
    }

    // If not authenticated, redirect to admin login
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // If it's only for administrators and the user isn't an admin, redirect
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />; 
    }

    // If all checks pass, render the content
    return children;
};

export default ProtectedRoute;