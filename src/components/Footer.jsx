import React from 'react';
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, PawPrint } from 'lucide-react';

function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
                            <PawPrint className="text-orange-500" /> PetStore
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Tu tienda de confianza para consentir a quienes más te quieren. Calidad y amor en cada producto.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white">Enlaces Rápidos</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li><Link to="/" className="hover:text-orange-400 transition-colors">Inicio</Link></li>
                            <li><Link to="/products" className="hover:text-orange-400 transition-colors">Productos</Link></li>
                            <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Contacto</Link></li>
                            <li><Link to="/profile" className="hover:text-orange-400 transition-colors">Mi Cuenta</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white">Contacto</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-orange-500 shrink-0 mt-1" />
                                <span>Av. Corrientes 1234,<br />Buenos Aires, Argentina</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-orange-500 shrink-0" />
                                <span>(011) 4567-8901</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-orange-500 shrink-0" />
                                <span>hola@petstore.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white">Newsletter</h4>
                        <p className="text-slate-400 text-sm mb-4">Suscríbete para recibir ofertas exclusivas.</p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            />
                            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors text-sm shadow-lg shadow-orange-900/20">
                                Suscribirse
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} PetStore. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;