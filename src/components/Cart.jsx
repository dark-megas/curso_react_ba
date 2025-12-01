import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import {toast} from "react-toastify";

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

            toast.error(`No puedes agregar más de ${item.stock} unidades. Stock máximo alcanzado.`);
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
                className="relative p-2 hover:bg-gray-100 rounded-full  transition-colors group"
                onClick={() => setIsOpen(true)}
                aria-label="Carrito de compras"
            >
                <ShoppingCart size={20} className="text-text-main group-hover:text-primary transition-colors" />
                {totalItems > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
                    >
                        {totalItems}
                    </motion.span>
                )}
            </button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                            />

                            {/* Sidebar */}
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-[60] flex flex-col"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                                        <ShoppingBag className="text-primary" /> Mi Carrito
                                    </h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Items */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {cart.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                                <ShoppingCart size={40} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-text-main">Tu carrito está vacío</p>
                                                <p className="text-text-muted">¡Agrega algunos productos para comenzar!</p>
                                            </div>
                                            <button
                                                onClick={() => setIsOpen(false)}
                                                className="mt-4 text-primary font-bold hover:underline"
                                            >
                                                Ver productos
                                            </button>
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <motion.div
                                                layout
                                                key={item.id}
                                                className="flex gap-4 bg-white"
                                            >
                                                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                    <img
                                                        src={
                                                            JSON.parse(item.avatar)[0]
                                                        }
                                                        alt={item.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-text-main line-clamp-1">{item.nombre}</h4>
                                                        <p className="text-primary font-bold">
                                                            {CURRENCY_SYMBOL}{item.precio.toLocaleString('es-AR')} {CURRENCY}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 text-gray-600 transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                {cart.length > 0 && (
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                                        {!tienEnvioGratis && faltaParaEnvioGratis > 0 && (
                                            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl text-sm text-center font-medium">
                                                💰 Te faltan {CURRENCY_SYMBOL}{faltaParaEnvioGratis.toLocaleString('es-AR')} {CURRENCY} para envío gratis
                                            </div>
                                        )}

                                        {tienEnvioGratis && (
                                            <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm text-center font-bold">
                                                🎉 ¡Tienes envío gratis!
                                            </div>
                                        )}

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-text-muted">
                                                <span>Subtotal</span>
                                                <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString('es-AR')} {CURRENCY}</span>
                                            </div>
                                            <div className="flex justify-between text-text-muted">
                                                <span>Envío</span>
                                                <span className={tienEnvioGratis ? 'text-green-600 font-bold' : ''}>
                                                    {tienEnvioGratis ? 'GRATIS' : `${CURRENCY_SYMBOL}${envio.toLocaleString('es-AR')} ${CURRENCY}`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-text-muted">
                                                <span>Impuestos ({(TAX_RATE * 100).toFixed(0)}%)</span>
                                                <span>{CURRENCY_SYMBOL}{impuestos.toLocaleString('es-AR')} {CURRENCY}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold text-text-main pt-2 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>{CURRENCY_SYMBOL}{total.toLocaleString('es-AR')} {CURRENCY}</span>
                                            </div>
                                        </div>

                                        <Link
                                            to="/checkout"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full bg-primary hover:bg-primary-hover text-white text-center font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                        >
                                            Iniciar Compra
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

export default Cart;