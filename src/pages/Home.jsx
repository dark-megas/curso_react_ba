import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import Hero from '../components/Hero.jsx';
import Benefits from '../components/Benefits.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { motion } from 'motion/react';

function Home() {
    const { productos, loadingProductos, errorProductos } = useAppContext();
    const productosDestacados = productos.slice(0, 4); // Show 4 items for better grid

    return (
        <div className="min-h-screen bg-background">
            <Hero />

            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-primary font-bold tracking-wider uppercase text-sm"
                        >
                            Favoritos
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-bold text-text-main mt-2"
                        >
                            Productos Destacados
                        </motion.h2>
                    </div>
                    <Link
                        to="/products"
                        className="hidden md:block text-text-main hover:text-primary font-medium transition-colors"
                    >
                        Ver todos los productos →
                    </Link>
                </div>

                {loadingProductos ? (
                    <div className="flex justify-center py-20">
                        <Loader message="Cargando productos destacados..." />
                    </div>
                ) : errorProductos ? (
                    <ErrorMessage message={errorProductos} />
                ) : productosDestacados.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {productosDestacados.map((producto, index) => (
                            <motion.div
                                key={producto.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <ProductCard product={producto} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-10">No hay productos disponibles</p>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Link
                        to="/products"
                        className="text-primary font-bold hover:underline"
                    >
                        Ver todos los productos →
                    </Link>
                </div>
            </section>

            <Benefits />
        </div>
    );
}

export default Home;