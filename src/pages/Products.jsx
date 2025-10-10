import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Products({ productos, loading, error, cart, setCart }) {
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const CURRENCY = import.meta.env.VITE_CURRENCY || 'ARS';

    const handleAddToCart = (producto) => {
        const productoEnCarrito = cart.find(item => item.id === producto.id);

        // Validar stock disponible
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

    if (loading) {
        return <Loader message="Cargando productos..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!productos || productos.length === 0) {
        return (
            <div className="no-products-container">
                <h2>No hay productos disponibles</h2>
                <p>Por favor, vuelve más tarde</p>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h2 className="products-title">Nuestros Productos</h2>
            <div className="products-grid">
                {productos.map((producto) => (
                    <div key={producto.id} className="product-card">
                        <img src={producto.avatar} alt={producto.nombre} className="product-image" />
                        <div className="product-info">
                            <h3 className="product-name">{producto.nombre}</h3>
                            <p className="product-description">{producto.descripcion}</p>
                            <p className="product-price">{CURRENCY_SYMBOL}{producto.precio.toLocaleString('es-AR')} {CURRENCY}</p>
                            <p className="product-stock">Stock: {producto.stock} unidades</p>
                            <div className="product-actions">
                                <Link to={`/product/${producto.id}`} className="btn-details">Ver Detalles</Link>
                                <button
                                    onClick={() => handleAddToCart(producto)}
                                    className="btn-add-cart"
                                    disabled={producto.stock === 0}
                                >
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;