import React from 'react';
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, PawPrint } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-amber-700/20 border-t border-gray-200 bg-text-main text-white pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <PawPrint className="text-primary" /> PetStore
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Tu tienda de confianza para consentir a quienes más te quieren. Calidad y amor en cada producto.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                            <li><Link to="/products" className="hover:text-primary transition-colors">Productos</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
                            <li><Link to="/profile" className="hover:text-primary transition-colors">Mi Cuenta</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Contacto</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary shrink-0 mt-1" />
                                <span>Av. Corrientes 1234,<br />Buenos Aires, Argentina</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-primary shrink-0" />
                                <span>(011) 4567-8901</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-primary shrink-0" />
                                <span>hola@petstore.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Suscríbete para recibir ofertas exclusivas.</p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="bg-primary hover:bg-primary-hover text-white font-bold py-2 rounded-lg transition-colors text-sm">
                                Suscribirse
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} PetStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;