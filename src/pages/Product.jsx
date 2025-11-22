import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Check, AlertCircle, Truck, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

function Product() {
    const { productos, loadingProductos, errorProductos, cart, addToCart } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const CURRENCY = import.meta.env.VITE_CURRENCY || 'ARS';
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const producto = productos.find(p => p.id === parseInt(id));

    const handleAddToCart = () => {
        // Verificar stock disponible
        const productoEnCarrito = cart.find(item => item.id === producto.id);
        const cantidadActualEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;
        const cantidadTotal = cantidadActualEnCarrito + quantity;

        if (cantidadTotal > producto.stock) {
            alert(`No puedes agregar más de ${producto.stock} unidades. Stock máximo alcanzado.`);
            return;
        }

        // Usar el helper addToCart del contexto
        addToCart(producto, quantity);

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loadingProductos) return <div className="min-h-screen flex items-center justify-center"><Loader message="Cargando producto..." /></div>;
    if (errorProductos) return <div className="min-h-screen flex items-center justify-center"><ErrorMessage message={errorProductos} /></div>;

    if (!producto) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full"
                >
                    <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main mb-2">Producto no encontrado</h2>
                    <p className="text-text-muted mb-6">Lo sentimos, el producto que buscas no existe o ha sido eliminado.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Volver a productos
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb / Back */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors font-medium"
                    >
                        <ArrowLeft size={20} />
                        Volver
                    </button>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-lg relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-bl-full -z-0 transition-transform group-hover:scale-110 duration-700" />
                        <img
                            src={producto.avatar}
                            alt={producto.nombre}
                            className="w-full h-[400px] md:h-[500px] object-contain relative z-10 drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                        />
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-secondary/20 text-secondary-hover text-xs font-bold uppercase tracking-wider rounded-full">
                                    {producto.categoria || 'General'}
                                </span>
                                {producto.stock > 0 ? (
                                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Stock disponible
                                    </span>
                                ) : (
                                    <span className="text-red-500 text-sm font-medium">Agotado</span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4 leading-tight">
                                {producto.nombre}
                            </h1>

                            <p className="text-3xl font-bold text-primary">
                                {CURRENCY_SYMBOL}{producto.precio.toLocaleString('es-AR')} <span className="text-lg text-text-muted font-normal">{CURRENCY}</span>
                            </p>
                        </div>

                        <div className="prose prose-gray max-w-none">
                            <p className="text-text-muted text-lg leading-relaxed">
                                {producto.descripcion}
                            </p>
                            {producto.detalles && (
                                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 text-sm text-text-muted">
                                    {producto.detalles}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border border-gray-200 rounded-xl bg-white">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 text-text-muted hover:text-primary transition-colors font-bold text-lg"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-text-main">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(producto.stock, quantity + 1))}
                                        className="px-4 py-3 text-text-muted hover:text-primary transition-colors font-bold text-lg"
                                        disabled={quantity >= producto.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={producto.stock === 0}
                                    className={clsx(
                                        "flex-1 py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1",
                                        added
                                            ? "bg-green-500 text-white"
                                            : producto.stock === 0
                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:translate-y-0"
                                                : "bg-primary hover:bg-primary-hover text-white"
                                    )}
                                >
                                    {added ? (
                                        <>
                                            <Check size={24} />
                                            ¡Agregado!
                                        </>
                                    ) : producto.stock === 0 ? (
                                        'Sin Stock'
                                    ) : (
                                        <>
                                            <ShoppingCart size={24} />
                                            Agregar al Carrito
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                    <Truck size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-text-main">Envío Gratis</p>
                                    <p className="text-text-muted text-xs">En compras mayores a $50k</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                                <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                                    <ShieldCheck size={20} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-bold text-text-main">Garantía</p>
                                    <p className="text-text-muted text-xs">30 días de devolución</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Product;