import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, PawPrint, Star, Heart } from 'lucide-react';

function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent -z-20" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-sm font-medium text-primary">
                        <Star size={16} className="fill-primary" />
                        <span>La tienda #1 para tu mascota</span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold text-text-main leading-tight">
                        Amor y cuidado <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">
                            para tu mejor amigo...
                        </span>
                    </h1>

                    <p className="text-xl text-text-muted max-w-lg leading-relaxed">
                        Encuentra los mejores productos, alimentos y accesorios para consentir a quien siempre te espera en casa.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                        >
                            Ver Productos <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-4 bg-white text-text-main font-bold rounded-2xl shadow-md hover:shadow-lg border border-gray-100 hover:-translate-y-1 transition-all"
                        >
                            Contáctanos
                        </Link>
                    </div>

                    <div className="flex items-center gap-8 pt-4">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                    <img
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-text-main">1000+ Clientes Felices</p>
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Image/Visual Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative z-10 bg-gradient-to-br from-primary to-secondary rounded-[3rem] p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img
                            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Happy Dog"
                            className="rounded-[2.5rem] w-full object-cover h-[500px]"
                        />

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -left-8 top-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
                        >
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <PawPrint size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-text-main">Calidad Premium</p>
                                <p className="text-xs text-text-muted">Solo lo mejor</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -right-8 bottom-24 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
                        >
                            <div className="bg-red-100 p-2 rounded-full text-red-500">
                                <Heart size={24} fill="currentColor" />
                            </div>
                            <div>
                                <p className="font-bold text-text-main">Hecho con Amor</p>
                                <p className="text-xs text-text-muted">Para tu mascota</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Hero;
