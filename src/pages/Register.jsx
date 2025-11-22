import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext.jsx';
import { motion } from 'motion/react';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

function Register() {
    const { register, loading } = useSupabase();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        direccion: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const metadata = {
            nombre: formData.nombre,
            telefono: formData.telefono,
            direccion: formData.direccion
        };

        const { error: registerError } = await register(formData.email, formData.password, metadata);

        if (registerError) {
            setError(registerError);
        } else {
            setSuccess('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">
                    {/* Decorative background blob */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-br-full -z-0" />

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-text-main mb-2">Crear Cuenta <Sparkles className="text-primary" size={28} /></h2>
                            <p className="text-text-muted">Únete a nuestra comunidad de amantes de las mascotas</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm"
                            >
                                <CheckCircle size={18} />
                                {success}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="nombre" className="text-sm font-medium text-text-main ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="email" className="text-sm font-medium text-text-main ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="telefono" className="text-sm font-medium text-text-main ml-1">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="(011) 1234-5678"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="direccion" className="text-sm font-medium text-text-main ml-1">Dirección</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="Av. Siempre Viva 123"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-text-main ml-1">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-text-main ml-1">Confirmar Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                                    {!loading && <ArrowRight size={20} />}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm text-text-muted">
                            <p>
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/login" className="text-primary font-bold hover:underline">
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Register;