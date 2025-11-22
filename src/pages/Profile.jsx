import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Shield, Camera } from 'lucide-react';
import clsx from 'clsx';

function Profile() {
    const { user, getProfile, updateProfile, loading } = useSupabase();
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

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
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
                                        disabled={loading}
                                        className="px-8 py-3 rounded-xl font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                                    >
                                        <Save size={20} />
                                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Profile;