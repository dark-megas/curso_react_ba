import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated, setUsuario, usuarios }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        const usuarioEncontrado = usuarios.find(
            u => u.email === formData.email && u.password === formData.password
        );

        if (usuarioEncontrado) {
            setIsAuthenticated(true);
            setUsuario({
                nombre: usuarioEncontrado.nombre,
                email: usuarioEncontrado.email,
                telefono: usuarioEncontrado.telefono || '',
                direccion: usuarioEncontrado.direccion || ''
            });
            navigate('/profile');
        } else {
            setError('Email o contraseña incorrectos');
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2 className="form-title">Iniciar Sesión</h2>
                {error && <div className="form-error">{error}</div>}
                <form onSubmit={handleSubmit} className="form">
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
                    <button type="submit" className="btn-submit">Iniciar Sesión</button>
                </form>
                <p className="form-footer">
                    ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
                </p>
            </div>
        </div>
    );
}

export default Login;