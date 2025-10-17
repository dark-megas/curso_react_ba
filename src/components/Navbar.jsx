import React, { useState } from 'react';
import {Link} from "react-router-dom";

function Navbar({isAuth}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (<>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">PetStore</Link>

                    {/* McBoton */}
                    <button
                        className="hamburger-btn"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    </button>

                    {/* Desktop Menu */}
                    <ul className="navbar-menu desktop-menu">
                        <li className="nav-item">
                            <Link to="/" className="navbar-link">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="navbar-link">Productos</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="navbar-link">Contacto</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/checkout" className="navbar-link">Checkout</Link>
                        </li>
                        {isAuth ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/profile" className="navbar-link">Mi Cuenta</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/logout" className="navbar-link">Logout</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="navbar-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="navbar-link">Registro</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {isMenuOpen && (
                <div className="mobile-menu-overlay" onClick={closeMenu}></div>
            )}

            {/* Mobile Sidebar Menu */}
            <div className={`mobile-menu-sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <Link to="/" className="mobile-menu-logo" onClick={closeMenu}>PetStore</Link>
                    <button className="mobile-menu-close" onClick={closeMenu}>
                        ✕
                    </button>
                </div>
                <ul className="mobile-menu-list">
                    <li className="mobile-nav-item">
                        <Link to="/" className="mobile-navbar-link" onClick={closeMenu}>Inicio</Link>
                    </li>
                    <li className="mobile-nav-item">
                        <Link to="/products" className="mobile-navbar-link" onClick={closeMenu}>Productos</Link>
                    </li>
                    <li className="mobile-nav-item">
                        <Link to="/contact" className="mobile-navbar-link" onClick={closeMenu}>Contacto</Link>
                    </li>
                    <li className="mobile-nav-item">
                        <Link to="/checkout" className="mobile-navbar-link" onClick={closeMenu}>Checkout</Link>
                    </li>
                    {isAuth ? (
                        <>
                            <li className="mobile-nav-item">
                                <Link to="/profile" className="mobile-navbar-link" onClick={closeMenu}>Mi Cuenta</Link>
                            </li>
                            <li className="mobile-nav-item">
                                <Link to="/logout" className="mobile-navbar-link" onClick={closeMenu}>Logout</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="mobile-nav-item">
                                <Link to="/login" className="mobile-navbar-link" onClick={closeMenu}>Login</Link>
                            </li>
                            <li className="mobile-nav-item">
                                <Link to="/register" className="mobile-navbar-link" onClick={closeMenu}>Registro</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>);
}

export default Navbar;