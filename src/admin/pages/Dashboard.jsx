import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useOrders } from '../hooks/useOrders.js';
import { useUsers } from '../hooks/useUsers.js';
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

// Componente visual de Tarjeta (KPI)
const StatCard = ({ title, value, icon: Icon, colorClass, subText }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between"
    >
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            {subText && (
                <p className="text-xs font-medium text-slate-400 mt-2">
                    {subText}
                </p>
            )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={24} className="text-white" />
        </div>
    </motion.div>
);

function Dashboard() {
    const { products } = useProducts();
    const { orders, getOrderStats } = useOrders();
    const { getUserStats } = useUsers();

    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        pending: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            const { data: orderStats } = await getOrderStats();
            const { data: userStats } = await getUserStats();

            setStats({
                products: products.length,
                orders: orderStats?.total || 0,
                users: userStats?.total || 0,
                revenue: orderStats?.totalRevenue || 0,
                pending: orderStats?.pending || 0,
                completed: orderStats?.completed || 0
            });
            setLoading(false);
        };

        loadStats();
    }, [products, orders]);

    // Función auxiliar para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard">
            <div className="p-6 bg-slate-50 min-h-screen">

                {/* Header de Bienvenida (Opcional, si quieres agregarlo) */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800">Resumen General</h2>
                    <p className="text-slate-500 text-sm">Aquí tienes lo que está pasando en tu tienda hoy.</p>
                </div>

                {/* Grid de Estadísticas (KPIs) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Ingresos Totales"
                        value={formatCurrency(stats.revenue)}
                        icon={DollarSign}
                        colorClass="bg-orange-500" // Color de marca principal
                        subText="Ingresos brutos acumulados"
                    />
                    <StatCard
                        title="Total Pedidos"
                        value={stats.orders}
                        icon={ShoppingCart}
                        colorClass="bg-blue-500"
                    />
                    <StatCard
                        title="Productos"
                        value={stats.products}
                        icon={Package}
                        colorClass="bg-indigo-500"
                    />
                    <StatCard
                        title="Total Usuarios"
                        value={stats.users}
                        icon={Users}
                        colorClass="bg-emerald-500"
                    />
                </div>

                {/* Sección Inferior: Tabla y Estado */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Tabla de Últimos Pedidos (Ocupa 2/3) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 text-lg">Últimos Pedidos</h3>
                            <Link to="/admin/orders">
                                <button className="text-sm text-orange-600 font-medium hover:underline flex items-center gap-1">
                                    Ver todos <ArrowRight size={16} />
                                </button>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                        <th className="pb-3 pl-2">ID</th>
                                        <th className="pb-3">Estado</th>
                                        <th className="pb-3 text-right pr-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-50">
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-4 pl-2 font-medium text-slate-700">#{order.id}</td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${order.status === 'completed' || order.status === 'paid'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : order.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {order.status === 'completed' ? 'Completado' : order.status === 'pending' ? 'Pendiente' : order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-2 font-bold text-slate-700">
                                                {formatCurrency(order.total_amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-8 text-slate-400">
                                                No hay pedidos recientes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Resumen de Estado de Pedidos (Ocupa 1/3) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-fit">
                        <h3 className="font-bold text-slate-800 text-lg mb-6">Estado de Pedidos</h3>
                        <div className="space-y-4">
                            {/* Pendientes */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock size={18} className="text-yellow-600" />
                                    </div>
                                    <span className="text-slate-600 font-medium">Pendientes</span>
                                </div>
                                <span className="font-bold text-2xl text-slate-800">{stats.pending}</span>
                            </div>

                            {/* Completados */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <CheckCircle size={18} className="text-emerald-600" />
                                    </div>
                                    <span className="text-slate-600 font-medium">Completados</span>
                                </div>
                                <span className="font-bold text-2xl text-slate-800">{stats.completed}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;