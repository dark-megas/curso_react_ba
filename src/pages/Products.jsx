import React from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { motion } from 'motion/react';

function Products() {
    const { productos, loadingProductos, errorProductos, cart, setCart } = useAppContext();

    const handleAddToCart = (producto) => {
        const productoEnCarrito = cart.find(item => item.id === producto.id);
        const cantidadActualEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

        if (cantidadActualEnCarrito >= producto.stock) {
            alert(`No puedes agregar más de ${producto.stock} unidades. Stock máximo alcanzado.`);
            return;
        }

        if (productoEnCarrito) {
            setCart(cart.map(item =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...producto, cantidad: 1 }]);
        }
    };

    if (loadingProductos) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <Loader message="Cargando productos..." />
            </div>
        );
    }

    if (errorProductos) {
        return (
            <div className="min-h-screen pt-24 px-6">
                <ErrorMessage message={errorProductos} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-text-main mb-4">Nuestros Productos</h1>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Explora nuestra selección de productos premium para tu mascota.
                    </p>
                </div>

                {!productos || productos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <h2 className="text-2xl font-bold text-text-main mb-2">No hay productos disponibles</h2>
                        <p className="text-text-muted">Por favor, vuelve más tarde</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {productos.map((producto, index) => (
                            <motion.div
                                key={producto.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard
                                    product={producto}
                                    onAddToCart={handleAddToCart}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;