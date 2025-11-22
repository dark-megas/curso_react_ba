import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import CircularText from "../../../@/components/CircularText.jsx";

function AdminProtectedRoute({ children }) {
    const { isAdmin, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="admin-loading-screen">
                <CircularText
                    text="REACT*BITS*COMPONENTS*"
                    onHover="speedUp"
                    spinDuration={20}
                    className="custom-class"
                />
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default AdminProtectedRoute;

