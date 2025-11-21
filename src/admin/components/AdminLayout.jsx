import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { useSupabase } from '../../context/SupabaseContext.jsx';

function AdminLayout({ children, title }) {
    const { adminProfile } = useAdminAuth();
    const { logout } = useSupabase();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/admin/products', icon: '📦', label: 'Productos' },
        { path: '/admin/categories', icon: '🏷️', label: 'Categorías' },
        { path: '/admin/orders', icon: '🛒', label: 'Pedidos' },
        { path: '/admin/users', icon: '👥', label: 'Usuarios' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="admin-sidebar-header">
                    <h2 className="admin-logo">🐾 Admin Panel</h2>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="admin-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {sidebarOpen && <span className="nav-label">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        {sidebarOpen && (
                            <>
                                <p className="admin-user-name">{adminProfile?.nombre || 'Admin'}</p>
                                <p className="admin-user-email">{adminProfile?.email}</p>
                            </>
                        )}
                    </div>
                    <button onClick={handleLogout} className="admin-logout-btn">
                        <span>🚪</span>
                        {sidebarOpen && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1 className="admin-page-title">{title}</h1>
                    <div className="admin-header-actions">
                        <span className="admin-user-badge">{adminProfile?.role}</span>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;

