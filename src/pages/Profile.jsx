import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';
import { useOrders } from '../hooks/useOrders.js';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Shield, Camera, Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';

function Profile() {
    const { user, getProfile, updateProfile, loading: profileLoading } = useSupabase();
    const { orders, loading: ordersLoading } = useOrders(); // Fetch user orders by default

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Cargar el perfil al montar el componente
    useEffect(() => {
        const loadProfile = async () => {
            const { profile: userProfile, error } = await getProfile();
            if (error) {
                setError(error);
            } else if (userProfile) {
                setProfile(userProfile);
                setFormData({
                    nombre: userProfile.nombre || '',
                    email: userProfile.email || '',
                    telefono: userProfile.telefono || '',
                    direccion: userProfile.direccion || ''
                });
            }
        };
        loadProfile();
    }, []);

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

        const updates = {
            nombre: formData.nombre,
            telefono: formData.telefono,
            direccion: formData.direccion
        };

        const { error: updateError } = await updateProfile(updates);

        if (updateError) {
            setError(updateError);
        } else {
            setSuccess('Perfil actualizado correctamente');
            setProfile({ ...profile, ...updates });
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleCancel = () => {
        setFormData({
            nombre: profile?.nombre || '',
            email: profile?.email || '',
            telefono: profile?.telefono || '',
            direccion: profile?.direccion || ''
        });
        setIsEditing(false);
        setError('');
    };

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const statusConfig = {
        pending: { label: 'Pendiente', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
        processing: { label: 'En Proceso', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Package },
        completed: { label: 'Completado', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
        cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100"
                >
                    {/* Header Background */}
                    <div className="h-48 bg-gradient-to-r from-secondary to-secondary-hover relative">
                        <div className="absolute inset-0 bg-pattern opacity-10" />
                    </div>

                    <div className="px-8 pb-8 relative">
                        {/* Avatar */}
                        <div className="relative -mt-20 mb-6 inline-block">
                            <div className="w-40 h-40 bg-white rounded-full p-2 shadow-lg">
                                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center overflow-hidden relative group">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-gray-400" />
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-text-main">{profile.nombre || 'Usuario sin nombre'}</h1>
                                <p className="text-text-muted flex items-center gap-2">
                                    <Shield size={16} className="text-primary" />
                                    Miembro verificado
                                </p>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    <Edit2 size={18} />
                                    Editar Perfil
                                </button>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 border border-green-100"
                            >
                                {success}
                            </motion.div>
                        )}

                        {!isEditing ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 text-text-muted mb-2">
                                            <Mail size={20} />
                                            <span className="text-sm font-bold uppercase tracking-wider">Email</span>
                                        </div>
                                        <p className="text-lg font-medium text-text-main pl-8">{profile.email}</p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3 text-text-muted mb-2">
                                            <Phone size={20} />
                                            <span className="text-sm font-bold uppercase tracking-wider">Teléfono</span>
                                        </div>
                                        <p className="text-lg font-medium text-text-main pl-8">{profile.telefono || 'No especificado'}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-full">
                                        <div className="flex items-center gap-3 text-text-muted mb-2">
                                            <MapPin size={20} />
                                            <span className="text-sm font-bold uppercase tracking-wider">Dirección de Envío</span>
                                        </div>
                                        <p className="text-lg font-medium text-text-main pl-8">{profile.direccion || 'No especificada'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-text-main ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-text-main ml-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-text-main ml-1">Teléfono</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                placeholder="+56 9 1234 5678"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-text-main ml-1">Dirección</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
                                                placeholder="Calle Principal 123, Ciudad"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex gap-4 justify-end pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 rounded-xl font-bold text-text-muted hover:bg-gray-100 transition-colors flex items-center gap-2"
                                    >
                                        <X size={20} />
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={profileLoading}
                                        className="px-8 py-3 rounded-xl font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                                    >
                                        <Save size={20} />
                                        {profileLoading ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>

                {/* Orders Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 p-8"
                >
                    <h2 className="text-2xl font-bold text-text-main mb-6 flex items-center gap-3">
                        <Package className="text-primary" size={28} />
                        Mis Pedidos
                    </h2>

                    {ordersLoading ? (
                        <div className="text-center py-12 text-text-muted">Cargando pedidos...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-text-muted font-medium">Aún no has realizado ningún pedido.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const StatusIcon = statusConfig[order.status]?.icon || Clock;
                                const isExpanded = expandedOrder === order.id;

                                return (
                                    <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden transition-all hover:shadow-md">
                                        {/* Order Header */}
                                        <div
                                            onClick={() => toggleOrder(order.id)}
                                            className="bg-gray-50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white rounded-xl border border-gray-200">
                                                    <Package size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-main">Pedido #{order.id}</p>
                                                    <p className="text-sm text-text-muted">{formatDate(order.created_at)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-6 flex-1">
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${statusConfig[order.status]?.color}`}>
                                                    <StatusIcon size={14} />
                                                    {statusConfig[order.status]?.label}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-text-main">{formatCurrency(order.total_amount)}</p>
                                                    <p className="text-xs text-text-muted">{order.order_items?.length} items</p>
                                                </div>
                                                {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                            </div>
                                        </div>

                                        {/* Order Details (Expanded) */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-gray-100"
                                                >
                                                    <div className="p-4 space-y-3">
                                                        {order.order_items?.map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                        {item.product?.avatar ? (
                                                                            <img
                                                                                src={Array.isArray(item.product.avatar) ? item.product.avatar[0] : JSON.parse(item.product.avatar)[0]}
                                                                                alt={item.product.nombre}
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.src = item.product.avatar; // Fallback for old string format
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                                <Package size={20} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-text-main text-sm">{item.product?.nombre || 'Producto eliminado'}</p>
                                                                        <p className="text-xs text-text-muted">Cant: {item.quantity}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="font-medium text-text-main text-sm">{formatCurrency(item.unit_price)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
}

export default Profile;