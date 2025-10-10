import React from 'react';
import {Link} from "react-router-dom";

function Navbar({isAuth}) {
    return (<>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">PetStore</Link>
                    <ul className="navbar-menu">
                        <li className="nav-item">
                            <Link to="/" className="navbar-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="navbar-link">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="navbar-link">Contact</Link>
                        </li>

                        {isAuth ? (
                            <li className="nav-item">
                                <Link to="/profile" className="navbar-link">Profile</Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="navbar-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="navbar-link">Register</Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <Link to="/checkout" className="navbar-link">Checkout</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>);
}

export default Navbar;