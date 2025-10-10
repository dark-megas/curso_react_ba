import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register({ usuarios, setUsuarios }) {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        telefono: '',
        direccion: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const usuarioExiste = usuarios.find(u => u.email === formData.email);
        if (usuarioExiste) {
            setError('El email ya está registrado');
            return;
        }

        const nuevoUsuario = {
            id: usuarios.length + 1,
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            direccion: formData.direccion
        };

        setUsuarios([...usuarios, nuevoUsuario]);
        navigate('/login');
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2 className="form-title">Registrarse</h2>
                {error && <div className="form-error">{error}</div>}
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre Completo</label>
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
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="btn-submit">Registrarse</button>
                </form>
                <p className="form-footer">
                    ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
                </p>
            </div>
        </div>
    );
}

export default Register;