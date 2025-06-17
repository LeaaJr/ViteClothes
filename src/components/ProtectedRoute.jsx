// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth(); // Obtén el estado de auth

    // Mientras se está cargando el estado de autenticación (ej. verificando token inicial)
    if (loading) {
        return <div>Loading authentication...</div>; // O un spinner/loading screen
    }

    // Si no está autenticado, redirige al login de admin
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si es solo para administradores y el usuario no es admin, redirige
    if (adminOnly && !isAdmin) {
        // Redirigir a "Acceso Denegado" o a la home
        return <Navigate to="/" replace />; 
    }

    // Si está ok y cumple los requisitos de rol, renderiza el contenido
    return children;
};

export default ProtectedRoute;