import React from 'react';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-title">PetStore</h3>
                    <p className="footer-text">Tu tienda de confianza para mascotas</p>
                </div>
                <div className="footer-section">
                    <h4 className="footer-subtitle">Enlaces</h4>
                    <ul className="footer-links">
                        <li><Link to="/products" className="footer-link">Productos</Link></li>
                        <li><Link to="/contact" className="footer-link">Contacto</Link></li>
                        <li><Link to="/profile" className="footer-link">Perfil</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4 className="footer-subtitle">Contacto</h4>
                    <p className="footer-text">Email: info@petstore.com</p>
                    <p className="footer-text">Tel: (123) 456-7890</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 PetStore. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;