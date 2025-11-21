import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';

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
        return <div className="profile-container">Cargando perfil...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">Mi Perfil</h2>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                {!isEditing ? (
                    <div className="profile-info">
                        <div className="profile-field">
                            <span className="profile-label">Nombre:</span>
                            <span className="profile-value">{profile.nombre || 'No especificado'}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-label">Email:</span>
                            <span className="profile-value">{profile.email}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-label">Teléfono:</span>
                            <span className="profile-value">{profile.telefono || 'No especificado'}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-label">Dirección:</span>
                            <span className="profile-value">{profile.direccion || 'No especificada'}</span>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="btn-edit">
                            Editar Perfil
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                                className="form-input"
                                title="El email no se puede modificar"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="direccion">Dirección</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-cancel">Cancelar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;