import { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext.jsx';

export const useOrders = () => {
    const { supabase } = useSupabase();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todas las órdenes con sus items y productos
    const fetchOrders = async () => {
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
                .order('created_at', { ascending: false });

            if (error) throw error;

            setOrders(data || []);
            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener órdenes:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener orden por ID
    const getOrderById = async (id) => {
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
                .eq('id', id)
                .single();

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener orden:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Actualizar estado de orden
    const updateOrderStatus = async (id, status) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('orders')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setOrders(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
            return { data, error: null };
        } catch (err) {
            console.error('Error al actualizar estado de orden:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Crear nueva orden
    const createOrder = async (orderData, orderItems) => {
        try {
            setLoading(true);
            setError(null);

            // Insertar la orden
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            // Insertar los items de la orden
            const itemsWithOrderId = orderItems.map(item => ({
                ...item,
                order_id: order.id
            }));

            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .insert(itemsWithOrderId)
                .select();

            if (itemsError) throw itemsError;

            const completeOrder = { ...order, order_items: items };
            setOrders(prev => [completeOrder, ...prev]);

            return { data: completeOrder, error: null };
        } catch (err) {
            console.error('Error al crear orden:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar orden
    const deleteOrder = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setOrders(prev => prev.filter(o => o.id !== id));
            return { error: null };
        } catch (err) {
            console.error('Error al eliminar orden:', err);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener estadísticas de órdenes
    const getOrderStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('orders')
                .select('status, total_amount');

            if (error) throw error;

            const stats = {
                total: data.length,
                pending: data.filter(o => o.status === 'pending').length,
                completed: data.filter(o => o.status === 'completed').length,
                cancelled: data.filter(o => o.status === 'cancelled').length,
                totalRevenue: data.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
            };

            return { data: stats, error: null };
        } catch (err) {
            console.error('Error al obtener estadísticas:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        orders,
        loading,
        error,
        fetchOrders,
        getOrderById,
        updateOrderStatus,
        createOrder,
        deleteOrder,
        getOrderStats
    };
};

