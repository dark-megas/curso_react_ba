import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSupabase} from '../../context/SupabaseContext.jsx';
import {useAdminAuth} from '../context/AdminAuthContext.jsx';
import Prism from "../../components/Prism.jsx";

function AdminLogin() {
    const {login, loading} = useSupabase();
    const {isAdmin} = useAdminAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirigir si ya está autenticado como admin
    useEffect(() => {
        if (isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [isAdmin, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const {user, error: loginError} = await login(formData.email, formData.password);

        if (loginError) {
            setError(loginError);
        } else if (user) {
            // Verificar si el usuario tiene rol de admin
            const role = user.user_metadata?.role;
            if (role !== 'admin') {
                setError('No tienes permisos de administrador');
                // Cerrar sesión automáticamente si no es admin
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const {logout} = useSupabase();
                await logout();
            } else {
                navigate('/admin/dashboard');
            }
        }
    };

    return (
        <>
            <div className="bg-black " style={{width: '100%', height: '100%', position: 'fixed'}}>
                <Prism
                    animationType="3drotate"
                    timeScale={0.5}
                    height={3.5}
                    baseWidth={5.5}
                    scale={3.6}
                    hueShift={0}
                    colorFrequency={1.0}
                    noise={0}
                    glow={1}
                />
            </div>
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <h1 className="admin-login-logo">PetStore</h1>
                        <h2 className="admin-login-title">Panel de Administración</h2>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="admin-login-form" style={{color:"#FFFFFF"}}>
                        <div className="form-group">
                            <label style={{color:"white"}}  htmlFor="email">Email de Administrador</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="admin@petstore.com"
                            />
                        </div>

                        <div className="form-group">
                            <label style={{color:"white"}} htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                className="form-input"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="admin-login-btn" disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p>Acceso restringido solo para administradores</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminLogin;

