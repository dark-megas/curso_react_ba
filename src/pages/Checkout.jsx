import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { useSupabase } from "../context/SupabaseContext.jsx";

function Checkout() {
    const {  cart, setCart } = useAppContext();
    const {  getProfile } = useSupabase();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [profile , setProfile] = useState(null);

    const SHIPPING_COST = parseFloat(import.meta.env.VITE_SHIPPING_COST) || 0;
    const FREE_SHIPPING_THRESHOLD = parseFloat(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 50000;
    const TAX_RATE = parseFloat(import.meta.env.VITE_TAX_RATE) || 0;
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const CURRENCY = import.meta.env.VITE_CURRENCY || 'ARS';


    useEffect(() => {
        const setupProfile = async () => {
            const { profile: userProfile, error } = await getProfile();
            console.log('Perfil obtenido en Checkout:', userProfile);
            if (error) {
                console.error('Error al obtener el perfil:', error);
            } else if (userProfile) {
                setProfile(userProfile);
                setUserInfo(userProfile);
            }
        };
        setupProfile();

    }, []);

    const calcularSubtotal = () => {
        return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const calcularEnvio = () => {
        const subtotal = calcularSubtotal();
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    };

    const calcularImpuestos = () => {
        const subtotal = calcularSubtotal();
        return subtotal * TAX_RATE;
    };

    const calcularTotal = () => {
        return calcularSubtotal() + calcularEnvio() + calcularImpuestos();
    };

    const handleRemoveItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id, cantidad) => {
        if (cantidad <= 0) {
            handleRemoveItem(id);
            return;
        }

        // Validar stock disponible
        const item = cart.find(item => item.id === id);
        if (item && cantidad > item.stock) {
            alert(`No puedes agregar más de ${item.stock} unidades. Stock máximo alcanzado.`);
            return;
        }

        setCart(cart.map(item =>
            item.id === id ? { ...item, cantidad } : item
        ));
    };

    const handlePlaceOrder = () => {
        if (!userInfo?.nombre || !userInfo?.email) {
            alert('Por favor completa tu información de perfil antes de realizar el pedido');
            navigate('/profile');
            return;
        }

        setOrderPlaced(true);
        setTimeout(() => {
            setCart([]);
            navigate('/products');
        }, 3000);
    };

    const subtotal = calcularSubtotal();
    const envio = calcularEnvio();
    const impuestos = calcularImpuestos();
    const total = calcularTotal();
    const tienEnvioGratis = subtotal >= FREE_SHIPPING_THRESHOLD;
    const faltaParaEnvioGratis = FREE_SHIPPING_THRESHOLD - subtotal;

    if (orderPlaced) {
        return (
            <div className="checkout-success">
                <h2>✓ ¡Pedido Realizado con Éxito!</h2>
                <p>Gracias por tu compra, {userInfo.nombre}</p>
                <p className="order-total">Total pagado: {CURRENCY_SYMBOL}{total.toLocaleString('es-AR')} {CURRENCY}</p>
                <p>Serás redirigido a productos en un momento...</p>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>Tu carrito está vacío</h2>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Ver Productos
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Finalizar Compra</h2>

            <div className="checkout-content">
                <div className="checkout-items">
                    <h3>Resumen del Pedido</h3>

                    {!tienEnvioGratis && faltaParaEnvioGratis > 0 && (
                        <div className="checkout-shipping-notice">
                            <p>
                                💰 Agrega {CURRENCY_SYMBOL}{faltaParaEnvioGratis.toLocaleString('es-AR')} {CURRENCY} más para obtener envío gratis
                            </p>
                        </div>
                    )}

                    {tienEnvioGratis && (
                        <div className="checkout-shipping-free">
                            <p>🎉 ¡Felicitaciones! Tienes envío gratis</p>
                        </div>
                    )}

                    {cart.map((item) => (
                        <div key={item.id} className="checkout-item">
                            <img src={item.avatar} alt={item.nombre} className="checkout-item-image" />
                            <div className="checkout-item-info">
                                <h4>{item.nombre}</h4>
                                <p>{CURRENCY_SYMBOL}{item.precio.toLocaleString('es-AR')} {CURRENCY}</p>
                            </div>
                            <div className="checkout-item-quantity">
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                                    className="btn-quantity"
                                >
                                    -
                                </button>
                                <span>{item.cantidad}</span>
                                <button
                                    onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                                    className="btn-quantity"
                                >
                                    +
                                </button>
                            </div>
                            <p className="checkout-item-subtotal">
                                {CURRENCY_SYMBOL}{(item.precio * item.cantidad).toLocaleString('es-AR')} {CURRENCY}
                            </p>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="btn-remove"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <div className="checkout-summary">
                    <h3>Información de Envío</h3>
                    {!userInfo?.nombre || !userInfo?.email ? (
                        <div className="checkout-warning">
                            <p>⚠️ Por favor completa tu información de perfil</p>
                            <button onClick={() => navigate('/profile')} className="btn-primary">
                                Ir a Perfil
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="checkout-user-info">
                                <p><strong>Nombre:</strong> {userInfo.nombre}</p>
                                <p><strong>Email:</strong> {userInfo.email}</p>
                                <p><strong>Teléfono:</strong> {userInfo.telefono || 'No especificado'}</p>
                                <p><strong>Dirección:</strong> {userInfo.direccion || 'No especificada'}</p>
                            </div>

                            <div className="checkout-pricing">
                                <div className="checkout-pricing-row">
                                    <span>Subtotal:</span>
                                    <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString('es-AR')} {CURRENCY}</span>
                                </div>
                                <div className="checkout-pricing-row">
                                    <span>Envío:</span>
                                    <span className={tienEnvioGratis ? 'free-shipping-text' : ''}>
                                        {tienEnvioGratis ? '¡GRATIS!' : `${CURRENCY_SYMBOL}${envio.toLocaleString('es-AR')} ${CURRENCY}`}
                                    </span>
                                </div>
                                <div className="checkout-pricing-row">
                                    <span>Impuestos ({(TAX_RATE * 100).toFixed(0)}%):</span>
                                    <span>{CURRENCY_SYMBOL}{impuestos.toLocaleString('es-AR')} {CURRENCY}</span>
                                </div>
                            </div>

                            <div className="checkout-total">
                                <h3>Total a Pagar</h3>
                                <p className="checkout-total-amount">
                                    {CURRENCY_SYMBOL}{total.toLocaleString('es-AR')} {CURRENCY}
                                </p>
                            </div>

                            <button onClick={handlePlaceOrder} className="btn-place-order">
                                Realizar Pedido
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Checkout;
