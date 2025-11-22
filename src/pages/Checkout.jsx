import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import { useSupabase } from "../context/SupabaseContext.jsx";
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CreditCard, CheckCircle, AlertTriangle, Truck, Package } from 'lucide-react';
import clsx from 'clsx';

function Checkout() {
    const { cart, setCart } = useAppContext();
    const { getProfile } = useSupabase();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    const SHIPPING_COST = parseFloat(import.meta.env.VITE_SHIPPING_COST) || 0;
    const FREE_SHIPPING_THRESHOLD = parseFloat(import.meta.env.VITE_FREE_SHIPPING_THRESHOLD) || 50000;
    const TAX_RATE = parseFloat(import.meta.env.VITE_TAX_RATE) || 0;
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const CURRENCY = import.meta.env.VITE_CURRENCY || 'ARS';

    useEffect(() => {
        const setupProfile = async () => {
            const { profile: userProfile, error } = await getProfile();
            if (userProfile) {
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
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main mb-2">¡Pedido Realizado!</h2>
                    <p className="text-text-muted mb-6">Gracias por tu compra, {userInfo.nombre}. Te hemos enviado un correo con los detalles.</p>
                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                        <p className="text-sm text-text-muted">Total pagado</p>
                        <p className="text-2xl font-bold text-primary">{CURRENCY_SYMBOL}{total.toLocaleString('es-AR')} {CURRENCY}</p>
                    </div>
                    <p className="text-sm text-text-muted animate-pulse">Redirigiendo a productos...</p>
                </motion.div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md"
                >
                    <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={48} className="text-secondary" />
                    </div>
                    <h2 className="text-3xl font-bold text-text-main mb-4">Tu carrito está vacío</h2>
                    <p className="text-text-muted mb-8 text-lg">¡Parece que aún no has elegido nada para tu mascota! Explora nuestros productos y encuentra algo especial.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Ver Productos
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-primary" />
                    Finalizar Compra
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
                                <Package size={20} className="text-secondary" />
                                Productos en tu carrito
                            </h2>

                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="flex gap-4 py-6 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 flex-shrink-0">
                                            <img src={item.avatar} alt={item.nombre} className="w-full h-full object-contain" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="font-bold text-text-main text-lg">{item.nombre}</h3>
                                                    <p className="text-primary font-bold">
                                                        {CURRENCY_SYMBOL}{item.precio.toLocaleString('es-AR')}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                                                        className="p-2 hover:text-primary transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-sm">{item.cantidad}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                                                        className="p-2 hover:text-primary transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <p className="font-bold text-text-main">
                                                    {CURRENCY_SYMBOL}{(item.precio * item.cantidad).toLocaleString('es-AR')}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Shipping Notice */}
                        {!tienEnvioGratis && faltaParaEnvioGratis > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4"
                            >
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <p className="text-blue-800 font-medium">
                                        ¡Estás a solo <span className="font-bold">{CURRENCY_SYMBOL}{faltaParaEnvioGratis.toLocaleString('es-AR')}</span> del envío gratis!
                                    </p>
                                    <Link to="/products" className="text-blue-600 text-sm hover:underline font-medium">
                                        Ver más productos
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {tienEnvioGratis && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4"
                            >
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <Truck size={24} />
                                </div>
                                <p className="text-green-800 font-bold">
                                    ¡Genial! Tienes envío gratis en este pedido.
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-text-main mb-6">Resumen del Pedido</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-text-muted">
                                    <span>Subtotal</span>
                                    <span>{CURRENCY_SYMBOL}{subtotal.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="flex justify-between text-text-muted">
                                    <span>Envío</span>
                                    <span className={tienEnvioGratis ? 'text-green-500 font-bold' : ''}>
                                        {tienEnvioGratis ? 'GRATIS' : `${CURRENCY_SYMBOL}${envio.toLocaleString('es-AR')}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-text-muted">
                                    <span>Impuestos ({(TAX_RATE * 100).toFixed(0)}%)</span>
                                    <span>{CURRENCY_SYMBOL}{impuestos.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4" />
                                <div className="flex justify-between text-xl font-bold text-text-main">
                                    <span>Total</span>
                                    <span>{CURRENCY_SYMBOL}{total.toLocaleString('es-AR')}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {!userInfo?.nombre || !userInfo?.email ? (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                                            <AlertTriangle size={20} />
                                            Información requerida
                                        </div>
                                        <p className="text-sm text-amber-800 mb-3">Completa tu perfil para continuar.</p>
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition-colors"
                                        >
                                            Ir a Perfil
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                                        <p className="font-bold text-text-main mb-2">Enviando a:</p>
                                        <p className="text-text-muted">{userInfo.nombre}</p>
                                        <p className="text-text-muted">{userInfo.direccion || 'Dirección no especificada'}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!userInfo?.nombre || !userInfo?.email}
                                    className={clsx(
                                        "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg",
                                        !userInfo?.nombre || !userInfo?.email
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-primary hover:bg-primary-hover text-white hover:shadow-xl hover:-translate-y-1"
                                    )}
                                >
                                    <CreditCard size={20} />
                                    Confirmar Pedido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
