import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';

function Profile() {
    const { usuario, setUsuario } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || '',
        direccion: usuario.direccion || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUsuario(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono || '',
            direccion: usuario.direccion || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">Mi Perfil</h2>

                {!isEditing ? (
                    <div className="profile-info">
                        <div className="profile-field">
                            <span className="profile-label">Nombre:</span>
                            <span className="profile-value">{usuario.nombre}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-label">Email:</span>
                            <span className="profile-value">{usuario.email}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-label">Teléfono:</span>
                            <span className="profile-value">{usuario.telefono || 'No especificado'}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-label">Dirección:</span>
                            <span className="profile-value">{usuario.direccion || 'No especificada'}</span>
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
                                required
                                className="form-input"
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
                            <button type="submit" className="btn-submit">Guardar Cambios</button>
                            <button type="button" onClick={handleCancel} className="btn-cancel">Cancelar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;