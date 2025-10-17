import React from 'react';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import Cart from "./Cart.jsx";
import '../App.css'
import { useAppContext } from '../context/AppContext.jsx';

function Layout({children, title}) {
    const { cart, setCart, isAuthenticated } = useAppContext();

    return (
        <>
            <Header title={title}/>
            <div className="layout">
                <Navbar isAuth={isAuthenticated}/>
                <Cart cart={cart} setCart={setCart}/>
                <main className="main-content">
                    {children}
                </main>
                <Footer/>
            </div>
        </>
    );
}

export default Layout;