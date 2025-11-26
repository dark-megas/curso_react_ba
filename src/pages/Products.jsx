import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Filter } from 'lucide-react';

function Products() {
    const { productos, categories, loadingProductos, errorProductos, addToCart, cart } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleAddToCart = (producto) => {
        const productoEnCarrito = cart.find(item => item.id === producto.id);
        const cantidadActualEnCarrito = productoEnCarrito ? productoEnCarrito.cantidad : 0;

        if (cantidadActualEnCarrito >= producto.stock) {
            alert(`No puedes agregar más de ${producto.stock} unidades. Stock máximo alcanzado.`);
            return;
        }

        // Usar el helper addToCart del contexto
        addToCart(producto, 1);
    };

    // Filtrar productos según búsqueda y categoría
    const filteredProducts = useMemo(() => {
        if (!productos) return [];

        return productos.filter(producto => {
            // Filtro de búsqueda
            const matchesSearch = searchTerm === '' ||
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro de categoría
            const matchesCategory = selectedCategory === null ||
                producto.categoria?.toLowerCase().includes(selectedCategory.toLowerCase());

            return matchesSearch && matchesCategory;
        });
    }, [productos, searchTerm, selectedCategory]);

    const clearSearch = () => {
        setSearchTerm('');
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
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-text-main mb-4">Nuestros Productos</h1>
                    <p className="text-text-muted max-w-2xl mx-auto">
                        Explora nuestra selección de productos premium para tu mascota.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-text-main placeholder:text-text-muted"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 text-text-muted">
                            <Filter size={18} />
                            <span className="text-sm font-medium">Categorías:</span>
                        </div>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${selectedCategory === null
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-text-muted hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            Todos
                        </button>
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.slug || category.nombre)}
                                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${selectedCategory === (category.slug || category.nombre)
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'bg-white text-text-muted hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {category.nombre}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="text-center text-sm text-text-muted">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white rounded-3xl shadow-sm"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-text-main mb-2">
                            {searchTerm || selectedCategory !== 'all'
                                ? 'No se encontraron productos'
                                : 'No hay productos disponibles'}
                        </h2>
                        <p className="text-text-muted mb-6">
                            {searchTerm || selectedCategory !== 'all'
                                ? 'Intenta con otros términos de búsqueda o categorías'
                                : 'Por favor, vuelve más tarde'}
                        </p>
                        {(searchTerm || selectedCategory !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                }}
                                className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${searchTerm}-${selectedCategory}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {filteredProducts.map((producto, index) => (
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
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

export default Products;