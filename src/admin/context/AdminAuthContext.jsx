import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabase } from '../../context/SupabaseContext.jsx';

const AdminAuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth debe ser usado dentro de AdminAuthProvider');
    }
    return context;
};

export const AdminAuthProvider = ({ children }) => {
    const { user, loading: authLoading, supabase } = useSupabase();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adminProfile, setAdminProfile] = useState(null);

    useEffect(() => {
        const checkAdminRole = async () => {
            if (!user) {
                setIsAdmin(false);
                setAdminProfile(null);
                setLoading(false);
                return;
            }

            try {
                // Verificar si el usuario tiene rol de admin en los metadatos
                const role = user.user_metadata?.role;

                if (role === 'admin') {
                    setIsAdmin(true);
                    setAdminProfile({
                        id: user.id,
                        email: user.email,
                        nombre: user.user_metadata?.nombre || '',
                        role: role
                    });
                } else {
                    setIsAdmin(false);
                    setAdminProfile(null);
                }
            } catch (error) {
                console.error('Error al verificar rol de admin:', error);
                setIsAdmin(false);
                setAdminProfile(null);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            checkAdminRole();
        }
    }, [user, authLoading, supabase]);

    const value = {
        isAdmin,
        loading: loading || authLoading,
        adminProfile,
        user
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export default AdminAuthContext;

