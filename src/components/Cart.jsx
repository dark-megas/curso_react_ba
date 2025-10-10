import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, setCart }) {
    const [isOpen, setIsOpen] = useState(false);

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

    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

    return (
        <>
            <button
                className="cart-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Carrito de compras"
            >
                🛒
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            {isOpen && (
                <>
                    <div className="cart-overlay" onClick={() => setIsOpen(false)} />
                    <div className="cart-sidebar">
                        <div className="cart-header">
                            <h3>Mi Carrito</h3>
                            <button
                                className="cart-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Cerrar carrito"
                            >
                                ✕
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="cart-empty-message">
                                <p>Tu carrito está vacío</p>
                                <Link to="/products" onClick={() => setIsOpen(false)}>
                                    Ver productos
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <img
                                                src={item.avatar}
                                                alt={item.nombre}
                                                className="cart-item-image"
                                            />
                                            <div className="cart-item-details">
                                                <h4>{item.nombre}</h4>
                                                <p className="cart-item-price">
                                                    ${item.precio.toLocaleString('es-CL')}
                                                </p>
                                                <div className="cart-item-controls">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                                                        className="cart-item-btn"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="cart-item-quantity">{item.cantidad}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                                                        className="cart-item-btn"
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="cart-item-remove"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="cart-footer">
                                    <div className="cart-total">
                                        <span>Total:</span>
                                        <span className="cart-total-amount">
                                            ${calcularTotal().toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                    <Link
                                        to="/checkout"
                                        className="cart-checkout-btn"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Ir al Checkout
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default Cart;