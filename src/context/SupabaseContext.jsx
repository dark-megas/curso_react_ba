import { createClient } from '@supabase/supabase-js';
import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el cliente de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_API_TOKEN;
const supabase = createClient(supabaseUrl, supabaseKey);

// Crear el contexto
const SupabaseContext = createContext();

// Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error('useSupabase debe ser usado dentro de un SupabaseProvider');
    }
    return context;
};

// Provider del contexto
export const SupabaseProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar la sesión actual al montar el componente
    useEffect(() => {
        // Obtener la sesión actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Escuchar cambios en la autenticación
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * Registrar un nuevo usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @param {object} metadata - Datos adicionales del usuario (nombre, teléfono, dirección, etc.)
     * @param role {string} role - Rol del usuario (por defecto 'user')
     * @returns {object} - { user, session, error }
     */
    const register = async (email, password, metadata = {}, role = 'admin') => {
        try {
            setError(null);
            setLoading(true);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        nombre: metadata.nombre || '',
                        telefono: metadata.telefono || '',
                        direccion: metadata.direccion || '',
                        role: role,
                        ...metadata
                    }
                }
            });

            if (error) throw error;

            setUser(data.user);
            setSession(data.session);

            return { user: data.user, session: data.session, error: null };
        } catch (err) {
            console.error('Error en register:', err);
            setError(err.message);
            return { user: null, session: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Iniciar sesión con email y contraseña
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {object} - { user, session, error }
     */
    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setUser(data.user);
            setSession(data.session);

            return { user: data.user, session: data.session, error: null };
        } catch (err) {
            console.error('Error en login:', err);
            setError(err.message);
            return { user: null, session: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Cerrar sesión
     * @returns {object} - { error }
     */
    const logout = async () => {
        try {
            setError(null);
            setLoading(true);

            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            setUser(null);
            setSession(null);

            return { error: null };
        } catch (err) {
            console.error('Error en logout:', err);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtener el perfil del usuario actual
     * @returns {object} - { profile, error }
     */
    const getProfile = async () => {
        try {
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            setError(null);

            // Obtener datos del usuario desde auth
            const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

            if (userError) throw userError;

            // Construir perfil con datos de user_metadata
            const profile = {
                id: currentUser.id,
                email: currentUser.email,
                nombre: currentUser.user_metadata?.nombre || '',
                telefono: currentUser.user_metadata?.telefono || '',
                direccion: currentUser.user_metadata?.direccion || '',
                created_at: currentUser.created_at,
                ...currentUser.user_metadata
            };

            return { profile, error: null };
        } catch (err) {
            console.error('Error en getProfile:', err);
            setError(err.message);
            return { profile: null, error: err.message };
        }
    };

    /**
     * Actualizar el perfil del usuario
     * @param {object} updates - Datos a actualizar
     * @returns {object} - { user, error }
     */
    const updateProfile = async (updates) => {
        try {
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            setError(null);
            setLoading(true);

            const { data, error } = await supabase.auth.updateUser({
                data: {
                    ...user.user_metadata,
                    ...updates
                }
            });

            if (error) throw error;

            setUser(data.user);

            return { user: data.user, error: null };
        } catch (err) {
            console.error('Error en updateProfile:', err);
            setError(err.message);
            return { user: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Resetear contraseña (enviar email)
     * @param {string} email - Email del usuario
     * @returns {object} - { error }
     */
    const resetPassword = async (email) => {
        try {
            setError(null);
            setLoading(true);

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            return { error: null };
        } catch (err) {
            console.error('Error en resetPassword:', err);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualizar contraseña
     * @param {string} newPassword - Nueva contraseña
     * @returns {object} - { user, error }
     */
    const updatePassword = async (newPassword) => {
        try {
            if (!user) {
                throw new Error('No hay usuario autenticado');
            }

            setError(null);
            setLoading(true);

            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            return { user: data.user, error: null };
        } catch (err) {
            console.error('Error en updatePassword:', err);
            setError(err.message);
            return { user: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Valor del contexto que se compartirá
    const value = {
        // Estado
        user,
        session,
        loading,
        error,
        isAuthenticated: !!user,

        // Métodos de autenticación
        register,
        login,
        logout,

        // Métodos de perfil
        getProfile,
        updateProfile,

        // Métodos de contraseña
        resetPassword,
        updatePassword,

        // Cliente de Supabase (por si se necesita acceso directo)
        supabase
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};

export default SupabaseContext;
