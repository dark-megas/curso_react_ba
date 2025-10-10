import React, { useState } from 'react';

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
        <div className="contact-container">
            <div className="contact-card">
                <h2 className="contact-title">Contáctanos</h2>

                {submitted ? (
                    <div className="contact-success">
                        <p>✓ ¡Mensaje enviado con éxito!</p>
                        <p>Te responderemos pronto.</p>
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
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                required
                                rows="5"
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="btn-submit">Enviar Mensaje</button>
                    </form>
                )}

                <div className="contact-info">
                    <h3>Información de Contacto</h3>
                    <p>📧 Email: info@petstore.com</p>
                    <p>📞 Teléfono: (123) 456-7890</p>
                    <p>📍 Dirección: Calle Principal 123, Santiago</p>
                </div>
            </div>
        </div>
    );
}

export default Contact;