import React from 'react';
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import '../App.css'
import { useSupabase } from '../context/SupabaseContext.jsx';

function Layout({ children, title }) {
    const { isAuthenticated } = useSupabase();

    return (
        <>
            <Header title={title} />
            <div className="layout">
                <Navbar isAuth={isAuthenticated} />
                <main className="main-content">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    );
}

export default Layout;