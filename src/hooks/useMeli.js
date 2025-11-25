import { useState } from 'react';

export const useMeli = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createPreference = async (items, payer, orderId) => {
        setLoading(true);
        setError(null);
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseKey = import.meta.env.VITE_API_TOKEN;
            const env = import.meta.env.VITE_ENV || 'LOCAL';

            // Map items to MercadoPago format if needed, or assume they are passed correctly
            // The edge function expects: title, quantity, unit_price, currency_id
            const mpItems = items.map(item => ({
                title: item.nombre || item.title,
                description: item.descripcion || item.description || '',
                quantity: parseInt(item.cantidad || item.quantity),
                unit_price: parseFloat(item.precio || item.unit_price),
                currency_id: 'ARS' // Default to ARS as per docs
            }));

            const response = await fetch(`${supabaseUrl}/functions/v1/meli_checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create_preference',
                    items: mpItems,
                    payer: {
                        email: payer?.email,
                        name: payer?.nombre || payer?.name,
                        surname: payer?.apellido || payer?.surname || ''
                    },
                    external_reference: orderId,
                    back_urls: {
                        success: window.location.origin + '/success',
                        failure: window.location.origin + '/failure',
                        pending: window.location.origin + '/pending'
                    },
                    redirect_urls: {
                        success: window.location.origin + '/success',
                        failure: window.location.origin + '/failure',
                        pending: window.location.origin + '/pending'
                    },
                    notification_url: `${supabaseUrl}/functions/v1/meli_checkout`,
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Error al crear la preferencia de pago');
            }

            // Determine redirect URL based on environment
            const redirectUrl = (env === 'LOCAL' || env === 'DEV')
                ? result.data.sandbox_init_point
                : result.data.init_point;

            return { ...result.data, redirectUrl };
        } catch (err) {
            console.error('Error useMeli:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createPreference, loading, error };
};
