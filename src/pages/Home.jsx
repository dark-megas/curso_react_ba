import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function Home({ productos, loading, error }) {
    const productosDestacados = productos.slice(0, 3);

    return (
        <div className="home-container">
            <section className="hero-section">
                <h1 className="hero-title">Bienvenido a PetStore</h1>
                <p className="hero-subtitle">Los mejores productos para tus mascotas</p>
                <Link to="/products" className="btn-hero">Ver Productos</Link>
            </section>

            <section className="featured-section">
                <h2 className="section-title">Productos Destacados</h2>

                {loading ? (
                    <Loader message="Cargando productos destacados..." />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : productosDestacados.length > 0 ? (
                    <div className="featured-grid">
                        {productosDestacados.map((producto) => (
                            <div key={producto.id} className="featured-card">
                                <img src={producto.avatar} alt={producto.nombre} className="featured-image" />
                                <h3 className="featured-name">{producto.nombre}</h3>
                                <p className="featured-price">${producto.precio.toLocaleString('es-CL')}</p>
                                <Link to={`/product/${producto.id}`} className="btn-featured">Ver Más</Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-products">No hay productos disponibles</p>
                )}
            </section>

            <section className="info-section">
                <div className="info-grid">
                    <div className="info-card">
                        <h3>🚚 Envío Gratis</h3>
                        <p>En compras sobre $50.000</p>
                    </div>
                    <div className="info-card">
                        <h3>🔒 Compra Segura</h3>
                        <p>Protegemos tus datos</p>
                    </div>
                    <div className="info-card">
                        <h3>⭐ Calidad Garantizada</h3>
                        <p>Los mejores productos</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;