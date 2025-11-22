import { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';

export const useOrder = () => {
    const { supabase, user } = useSupabase();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Crear nueva orden con sus items
    const createOrder = async (cart, userInfo, totals) => {
        try {
            setLoading(true);
            setError(null);

            // Validar que haya un usuario autenticado
            if (!user) {
                throw new Error('Debes iniciar sesión para realizar una compra');
            }

            // Preparar datos de la orden
            const orderData = {
                user_id: user.id,
                user_email: userInfo.email || user.email,
                user_name: userInfo.name || user.user_metadata?.full_name || '',
                user_phone: userInfo.phone || user.user_metadata?.phone || '',
                user_address: userInfo.address || '',
                subtotal: totals.subtotal,
                shipping_cost: totals.shipping,
                tax_amount: totals.tax,
                total_amount: totals.total,
                status: 'pending',
                payment_method: userInfo.paymentMethod || 'pending',
                notes: userInfo.notes || ''
            };

            // Insertar la orden
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            // Preparar items de la orden
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.nombre,
                product_image: item.avatar || item.imagenes?.[0] || '',
                quantity: item.cantidad,
                unit_price: item.precio,
                subtotal: item.precio * item.cantidad
            }));

            // Insertar los items de la orden
            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)
                .select();

            if (itemsError) throw itemsError;

            // Actualizar stock de productos
            for (const item of cart) {
                const { error: stockError } = await supabase.rpc('decrease_product_stock', {
                    product_id: item.id,
                    quantity: item.cantidad
                });

                // Si no existe la función RPC, hacer update manual
                if (stockError && stockError.code === '42883') {
                    const { data: product } = await supabase
                        .from('products')
                        .select('stock')
                        .eq('id', item.id)
                        .single();

                    if (product) {
                        await supabase
                            .from('products')
                            .update({ stock: product.stock - item.cantidad })
                            .eq('id', item.id);
                    }
                }
            }

            const completeOrder = { ...order, order_items: items };
            return { data: completeOrder, error: null };
        } catch (err) {
            console.error('Error al crear orden:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener órdenes del usuario actual
    const getUserOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user) {
                throw new Error('Debes iniciar sesión para ver tus órdenes');
            }

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        product:products (*)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

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
    const getOrderById = async (orderId) => {
        try {
            setLoading(true);
            setError(null);

            if (!user) {
                throw new Error('Debes iniciar sesión para ver esta orden');
            }

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        product:products (*)
                    )
                `)
                .eq('id', orderId)
                .eq('user_id', user.id) // Asegurar que solo vea sus propias órdenes
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

    // Cancelar orden (solo si está en estado pending)
    const cancelOrder = async (orderId) => {
        try {
            setLoading(true);
            setError(null);

            if (!user) {
                throw new Error('Debes iniciar sesión para cancelar una orden');
            }

            // Verificar que la orden pertenece al usuario y está en pending
            const { data: order, error: fetchError } = await supabase
                .from('orders')
                .select('status, order_items(*)')
                .eq('id', orderId)
                .eq('user_id', user.id)
                .single();

            if (fetchError) throw fetchError;

            if (order.status !== 'pending') {
                throw new Error('Solo puedes cancelar órdenes pendientes');
            }

            // Actualizar estado de la orden
            const { data, error } = await supabase
                .from('orders')
                .update({ status: 'cancelled', updated_at: new Date().toISOString() })
                .eq('id', orderId)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;

            // Restaurar stock de productos
            for (const item of order.order_items) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.product_id)
                    .single();

                if (product) {
                    await supabase
                        .from('products')
                        .update({ stock: product.stock + item.quantity })
                        .eq('id', item.product_id);
                }
            }

            return { data, error: null };
        } catch (err) {
            console.error('Error al cancelar orden:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Validar carrito antes de crear orden
    const validateCart = async (cart) => {
        try {
            const validationErrors = [];

            for (const item of cart) {
                const { data: product, error } = await supabase
                    .from('products')
                    .select('stock, status')
                    .eq('id', item.id)
                    .single();

                if (error || !product) {
                    validationErrors.push(`Producto ${item.nombre} no encontrado`);
                    continue;
                }

                if (!product.status) {
                    validationErrors.push(`Producto ${item.nombre} no está disponible`);
                    continue;
                }

                if (product.stock < item.cantidad) {
                    validationErrors.push(
                        `Stock insuficiente para ${item.nombre}. Disponible: ${product.stock}, Solicitado: ${item.cantidad}`
                    );
                }
            }

            return {
                valid: validationErrors.length === 0,
                errors: validationErrors
            };
        } catch (err) {
            console.error('Error al validar carrito:', err);
            return {
                valid: false,
                errors: ['Error al validar el carrito']
            };
        }
    };

    return {
        loading,
        error,
        createOrder,
        getUserOrders,
        getOrderById,
        cancelOrder,
        validateCart
    };
};
