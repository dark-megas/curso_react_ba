import React from 'react';
import {Link} from "react-router-dom";

function Navbar({isAuth}) {
    return (<>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">PetStore</Link>
                    <ul className="navbar-menu">
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
        </>);
}

export default Navbar;