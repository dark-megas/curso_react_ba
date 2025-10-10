import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ usuario, cart, setCart }) {
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [userInfo, setUserInfo] = useState(usuario);
    const navigate = useNavigate();

    useEffect(() => {
        if (usuario && usuario.nombre) {
            setUserInfo(usuario);
        }
    }, [usuario]);

    const calcularTotal = () => {
        return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const handleRemoveItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id, cantidad) => {
        if (cantidad <= 0) {
            handleRemoveItem(id);
            return;
        }
        setCart(cart.map(item =>
            item.id === id ? { ...item, cantidad } : item
        ));
    };

    const handlePlaceOrder = () => {
        if (!userInfo.nombre || !userInfo.email) {
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

    if (orderPlaced) {
        return (
            <div className="checkout-success">
                <h2>✓ ¡Pedido Realizado con Éxito!</h2>
                <p>Gracias por tu compra, {userInfo.nombre}</p>
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
                    {cart.map((item) => (
                        <div key={item.id} className="checkout-item">
                            <img src={item.avatar} alt={item.nombre} className="checkout-item-image" />
                            <div className="checkout-item-info">
                                <h4>{item.nombre}</h4>
                                <p>${item.precio.toLocaleString('es-CL')}</p>
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
                                ${(item.precio * item.cantidad).toLocaleString('es-CL')}
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
                    {!userInfo.nombre || !userInfo.email ? (
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

                            <div className="checkout-total">
                                <h3>Total a Pagar</h3>
                                <p className="checkout-total-amount">
                                    ${calcularTotal().toLocaleString('es-CL')}
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