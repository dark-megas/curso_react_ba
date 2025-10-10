import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Product({ productos, loading, error, cart, setCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const CURRENCY = import.meta.env.VITE_CURRENCY || 'ARS';

    const producto = productos.find(p => p.id === parseInt(id));

    const handleAddToCart = () => {
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
        return <Loader message="Cargando producto..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!producto) {
        return (
            <div className="not-found">
                <h2>Producto no encontrado</h2>
                <button onClick={() => navigate('/products')} className="btn-primary">
                    Volver a productos
                </button>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <button onClick={() => navigate(-1)} className="btn-back">← Volver</button>
            <div className="product-detail">
                <div className="product-detail-image">
                    <img src={producto.avatar} alt={producto.nombre} />
                </div>
                <div className="product-detail-info">
                    <h1>{producto.nombre}</h1>
                    <p className="product-detail-description">{producto.descripcion}</p>
                    <p className="product-detail-details">{producto.detalles}</p>
                    <p className="product-detail-category">Categoría: {producto.categoria || 'General'}</p>
                    <div className="product-detail-pricing">
                        <p className="product-detail-price">{CURRENCY_SYMBOL}{producto.precio.toLocaleString('es-AR')} {CURRENCY}</p>
                        <p className="product-detail-stock">Stock disponible: {producto.stock} unidades</p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="btn-add-cart-large"
                        disabled={producto.stock === 0}
                    >
                        {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;