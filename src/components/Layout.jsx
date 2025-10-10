import React from 'react';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import Cart from "./Cart.jsx";
import '../App.css'

function Layout({children, title, cart, setCart, isAuth}) {
    return (
        <>

            <Header title={title}/>
            <div className="layout">
                <Navbar isAuth={isAuth}/>
                {cart && setCart && <Cart cart={cart} setCart={setCart}/>}
                <main className="main-content">
                    {children}
                </main>
                <Footer/>
            </div>
        </>
    );
}

export default Layout;