import { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';

export const useOrders = (isAdmin = false) => {
    const { supabase, user } = useSupabase();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        product:products (*)
                    )
                `)
                .order('created_at', { ascending: false });

            if (!isAdmin && user) {
                query = query.eq('user_id', user.id);
            }

            const { data, error } = await query;

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Realtime Subscription
    useEffect(() => {
        if (!user) return;

        fetchOrders();

        const channel = supabase
            .channel('orders_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Order change received!', payload);
                    // If not admin, only refresh if the order belongs to the user
                    if (!isAdmin && payload.new && payload.new.user_id !== user.id) {
                        return;
                    }
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, isAdmin]);

    // Create Order
    const createOrder = async (cart, userInfo, totals) => {
        try {
            setLoading(true);
            if (!user) throw new Error('Debes iniciar sesión');

            const orderData = {
                user_id: user.id,
                total_amount: totals.total,
                status: 'pending',
                // Add other fields if necessary
            };

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.cantidad,
                unit_price: item.precio,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            return { data: order, error: null };
        } catch (err) {
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Update Order Status (Admin)
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            return { data: null, error: err.message };
        }
    };

    return {
        orders,
        loading,
        error,
        createOrder,
        updateOrderStatus,
        refreshOrders: fetchOrders
    };
};
