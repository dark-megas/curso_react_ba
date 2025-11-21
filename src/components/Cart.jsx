import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart, setCart }) {
    const [isOpen, setIsOpen] = useState(false);

    // Configuración desde .env
    const SHIPPING_COST = parseFloat(import.meta.env.VITE_SHIPPING_COST) || 0;
    const FREE_SHIPPING_THRESHOLD = parseFloat(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 50000;
    const TAX_RATE = parseFloat(import.meta.env.VITE_TAX_RATE) || 0;
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const CURRENCY = import.meta.env.VITE_CURRENCY || 'ARS';

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

    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
    const subtotal = calcularSubtotal();
    const envio = calcularEnvio();
    const impuestos = calcularImpuestos();
    const total = calcularTotal();
    const tienEnvioGratis = subtotal >= FREE_SHIPPING_THRESHOLD;
    const faltaParaEnvioGratis = FREE_SHIPPING_THRESHOLD - subtotal;

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
                                                    {CURRENCY_SYMBOL}{item.precio.toLocaleString('es-AR')} {CURRENCY}
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
                                    {!tienEnvioGratis && faltaParaEnvioGratis > 0 && (
                                        <div className="cart-shipping-notice">
                                            <p>
                                                💰 Te faltan {CURRENCY_SYMBOL}{faltaParaEnvioGratis.toLocaleString('es-AR')} {CURRENCY} para envío gratis
                                            </p>
                                        </div>
                                    )}

                                    {tienEnvioGratis && (
                                        <div className="cart-shipping-free">
                                            <p>🎉 ¡Envío gratis!</p>
                                        </div>
                                    )}

                                    <div className="cart-summary">
                                        <div className="cart-summary-row">
                                            <span>Subtotal:</span>
                                            <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString('es-AR')} {CURRENCY}</span>
                                        </div>
                                        <div className="cart-summary-row">
                                            <span>Envío:</span>
                                            <span className={tienEnvioGratis ? 'free-shipping' : ''}>
                                                {tienEnvioGratis ? 'GRATIS' : `${CURRENCY_SYMBOL}${envio.toLocaleString('es-AR')} ${CURRENCY}`}
                                            </span>
                                        </div>
                                        <div className="cart-summary-row">
                                            <span>Impuestos ({(TAX_RATE * 100).toFixed(0)}%):</span>
                                            <span>{CURRENCY_SYMBOL}{impuestos.toLocaleString('es-AR')} {CURRENCY}</span>
                                        </div>
                                        <div className="cart-total">
                                            <span>Total:</span>
                                            <span className="cart-total-amount">
                                                {CURRENCY_SYMBOL}{total.toLocaleString('es-AR')} {CURRENCY}
                                            </span>
                                        </div>
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