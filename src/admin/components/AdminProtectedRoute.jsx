import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

function AdminProtectedRoute({ children }) {
    const { isAdmin, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="admin-loading-screen">
                <div className="loading-spinner"></div>
                <p>Verificando permisos...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default AdminProtectedRoute;

