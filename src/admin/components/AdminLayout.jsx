import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { useSupabase } from '../../context/SupabaseContext.jsx';
// Importamos iconos profesionales
import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    PawPrint,
    SatelliteIcon,
    Store,
} from 'lucide-react';

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

    // Mapeo de rutas con iconos reales
    const menuItems = [
        { path: '/', icon: Store, label: 'Tienda' },
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Productos' },
        { path: '/admin/categories', icon: Tags, label: 'Categorías' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Pedidos' },
        { path: '/admin/users', icon: Users, label: 'Usuarios' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* SIERBAR (Barra Lateral) */}
            <aside
                className={`bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col relative z-20
                ${sidebarOpen ? 'w-64' : 'w-20'}`}
            >
                {/* Logo Area */}
                <Link to="/admin/dashboard">
                    <div className="h-16 flex items-center justify-center border-b border-slate-800">
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <div className="bg-orange-500 p-1.5 rounded-lg">
                                <PawPrint size={20} className="text-white" />
                            </div>
                            {sidebarOpen && <span className="animate-fade-in">Admin</span>}
                        </div>
                    </div>
                </Link>

                {/* Botón de Colapsar (Flotante) */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute -right-3 top-20 bg-white border border-slate-200 text-slate-500 rounded-full p-1 shadow-md hover:bg-slate-100 transition-colors z-30"
                >
                    {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Navegación */}
                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                ${isActive
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />

                                {sidebarOpen && (
                                    <span className="font-medium text-sm truncate">
                                        {item.label}
                                    </span>
                                )}

                                {/* Tooltip para cuando está cerrado */}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer del Sidebar (Perfil + Logout) */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                            {adminProfile?.nombre?.charAt(0) || 'A'}
                        </div>

                        {sidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">
                                    {adminProfile?.nombre || 'Admin'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {adminProfile?.role || 'Super Admin'}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`mt-4 w-full flex items-center gap-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors text-sm font-medium
                        ${!sidebarOpen ? 'justify-center' : ''}`}
                    >
                        <LogOut size={18} />
                        {sidebarOpen && "Cerrar Sesión"}
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Superior */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <h1 className="text-xl font-bold text-slate-800">{title}</h1>

                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                            v1.0.0
                        </span>
                    </div>
                </header>

                {/* Área de Scroll */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;