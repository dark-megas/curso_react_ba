import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext.jsx';
import { useOrders } from '../hooks/useOrders'; // Asegúrate de que la importación sea correcta
import { useNavigate } from 'react-router-dom';

function FallbackMeli({ status }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSupabase();

    const { getOrderById, updateOrder } = useOrders();

    const runOnce = useRef(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const external_reference = searchParams.get('external_reference');

        if (runOnce.current || !external_reference) return;

        runOnce.current = true;

        const procesarOrden = async () => {
            try {
                const order = await getOrderById(external_reference);
                //si no existe la orden, la creamos
                if (!order) {
                    //navegamos al home
                    navigate('/');
                }
                //si la orden no pertenece al usuario, redirigimos al home
                if (order.user_id !== user.id) {
                    navigate('/');
                }

                //in array status ['paid', 'success', 'pending']
                if (!['paid', 'success', 'pending'].includes(order.status)) {
                    navigate('/');
                }

                //navegamos al checkout
                navigate('/profile');

            } catch (error) {
                console.error("Error procesando orden", error);
            }
        };

        procesarOrden();

        // Es buena práctica incluir las dependencias externas que usas dentro del efecto
    }, [location.search, getOrderById, status]);

    return (
        <div>
            <h1>Procesando pago...</h1>
        </div>
    )
}

export default FallbackMeli;