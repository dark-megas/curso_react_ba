import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut, PawPrint } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';
import Cart from './Cart.jsx';
import clsx from 'clsx';

function Navbar({ isAuth, getProfile }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cart, setCart } = useAppContext();
    const location = useLocation();
    const user_profile = getProfile?.user_metadata;


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Inicio', href: '/' },
        { label: 'Productos', href: '/products' },
        { label: 'Contacto', href: '/contact' },
    ];

    const authLinks = isAuth
        ? [
            { label: 'Checkout', href: '/checkout' },
            { label: 'Mi Cuenta', href: '/profile', icon: User },
            { label: 'Logout', href: '/logout', icon: LogOut },
        ]
        : [
            { label: 'Login', href: '/login' },
            { label: 'Registro', href: '/register' },
        ];

    //Route for role admin
    const adminLinks = [
        { label: 'Admin', href: '/admin' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4',
                isScrolled
                    ? 'bg-surface-glass/80 backdrop-blur-xl shadow-sm py-3 border-b border-white/20'
                    : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
                    <PawPrint className="text-primary" /> PetStore
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={clsx(
                                'text-sm font-medium transition-colors hover:text-primary relative group',
                                location.pathname === link.href ? 'text-primary' : 'text-text-main'
                            )}
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {/* Desktop Auth Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {authLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={clsx(
                                    'text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
                                    location.pathname === link.href ? 'text-primary' : 'text-text-main'
                                )}
                            >
                                {link.icon && <link.icon size={16} />}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {user_profile?.role === 'admin' && (
                        <div className="hidden md:flex items-center gap-6">
                            {adminLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={clsx(
                                        'text-sm font-medium transition-colors hover:text-primary flex items-center gap-1',
                                        location.pathname === link.href ? 'text-primary' : 'text-text-main'
                                    )}
                                >
                                    {link.icon && <link.icon size={16} />}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Cart - Always visible */}
                    <Cart cart={cart} setCart={setCart} />

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-text-main"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-text-main hover:text-primary font-medium"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <hr className="border-gray-100" />
                            {authLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-text-main hover:text-primary font-medium flex items-center gap-2"
                                >
                                    {link.icon && <link.icon size={16} />}
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Navbar;