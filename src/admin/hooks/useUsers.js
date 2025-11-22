import { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext.jsx';

export const useUsers = () => {
    const { supabase } = useSupabase();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todos los usuarios (desde auth.users mediante función RPC o vista)
    // Nota: Por seguridad, Supabase no permite acceso directo a auth.users
    // Se debe crear una vista o función en la base de datos
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener usuarios a través de la tabla de órdenes para ver usuarios activos
            const { data, error } = await supabase
                .from('orders')
                .select('user_id')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Obtener IDs únicos de usuarios
            const uniqueUserIds = [...new Set(data.map(o => o.user_id))];

            // Obtener información de usuarios de Supabase Auth
            const usersData = [];
            for (const userId of uniqueUserIds) {
                try {
                    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
                    if (!userError && user) {
                        usersData.push({
                            id: user.id,
                            email: user.email,
                            nombre: user.user_metadata?.nombre || '',
                            telefono: user.user_metadata?.telefono || '',
                            direccion: user.user_metadata?.direccion || '',
                            role: user.user_metadata?.role || 'user',
                            created_at: user.created_at
                        });
                    }
                } catch (err) {
                    console.error(`Error al obtener usuario ${userId}:`, err);
                }
            }

            setUsers(usersData);
            return { data: usersData, error: null };
        } catch (err) {
            console.error('Error al obtener usuarios:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener estadísticas de usuarios
    const getUserStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data: orders, error } = await supabase
                .from('orders')
                .select('user_id, created_at');

            if (error) throw error;

            const uniqueUsers = [...new Set(orders.map(o => o.user_id))];
            const stats = {
                total: uniqueUsers.length,
                withOrders: uniqueUsers.length,
                totalOrders: orders.length,
                averageOrdersPerUser: orders.length / (uniqueUsers.length || 1)
            };

            return { data: stats, error: null };
        } catch (err) {
            console.error('Error al obtener estadísticas de usuarios:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener órdenes por usuario
    const getUserOrders = async (userId) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        product:products (*)
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener órdenes del usuario:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        getUserStats,
        getUserOrders
    };
};

