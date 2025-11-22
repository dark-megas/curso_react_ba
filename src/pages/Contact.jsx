import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';

function Contact() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ nombre: '', email: '', mensaje: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-text-main mb-4">Contáctanos</h1>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte a ti y a tu mascota.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-text-main mb-6">Información de Contacto</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-main">Email</h3>
                                        <p className="text-text-muted">info@petstore.com</p>
                                        <p className="text-text-muted text-sm">Respondemos en menos de 24hs</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-main">Teléfono</h3>
                                        <p className="text-text-muted">(123) 456-7890</p>
                                        <p className="text-text-muted text-sm">Lunes a Viernes, 9am - 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-accent/20 p-3 rounded-xl text-yellow-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-main">Ubicación</h3>
                                        <p className="text-text-muted">Calle Principal 123</p>
                                        <p className="text-text-muted">Santiago, Chile</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">¿Necesitas ayuda urgente?</h3>
                                <p className="mb-6 text-white/90">Nuestro equipo de soporte está disponible para emergencias.</p>
                                <button className="bg-white text-primary font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-md">
                                    Chatear con Soporte
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
                    >
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-text-main mb-2">¡Mensaje Enviado!</h3>
                                <p className="text-text-muted">Gracias por contactarnos. Te responderemos a la brevedad.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-2">
                                    <MessageSquare className="text-primary" size={24} />
                                    Envíanos un mensaje
                                </h2>

                                <div className="space-y-2">
                                    <label htmlFor="nombre" className="block text-sm font-bold text-text-main">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-bold text-text-main">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="mensaje" className="block text-sm font-bold text-text-main">Mensaje</label>
                                    <textarea
                                        id="mensaje"
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Enviar Mensaje
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Contact;