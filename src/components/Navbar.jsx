import React from 'react';
import PillNav from "../../@/components/PillNav.jsx";
import logo from '../assets/logo.png'

function Navbar({ isAuth }) {

    return (<>
        <div className="mb-8 flex justify-center w-full">
            <PillNav
                logo={logo}
                items={[
                    { label: 'Inicio', href: '/' },
                    { label: 'Productos', href: '/products' },
                    ...(isAuth
                        ? [
                            { label: 'Checkout', href: '/checkout' },
                            { label: 'Mi Cuenta', href: '/profile' },
                            { label: 'Logout', href: '/logout' },
                        ]
                        : [
                            { label: 'Login', href: '/login' },
                            { label: 'Registro', href: '/register' },
                        ]),
                    { label: 'Contacto', href: '/contact' },
                ]}
                activeHref={window.location.pathname}
                className="gap-4 w-full max-w-3xl"
                ease="power3.easeOut"
                baseColor="#d1fae5"
                pillColor="#ffffff"
                hoveredPillTextColor="#000000"
                pillTextColor="#000000"
            />
        </div>
    </>);
}

export default Navbar;