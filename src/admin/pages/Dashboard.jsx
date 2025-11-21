import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useOrders } from '../hooks/useOrders.js';
import { useUsers } from '../hooks/useUsers.js';

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

    const StatCard = ({ icon, title, value, color }) => (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-details">
                <h3 className="stat-title">{title}</h3>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <div className="admin-loading">Cargando estadísticas...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard">
            <div className="dashboard-container">
                <div className="stats-grid">
                    <StatCard
                        icon="📦"
                        title="Total Productos"
                        value={stats.products}
                        color="blue"
                    />
                    <StatCard
                        icon="🛒"
                        title="Total Pedidos"
                        value={stats.orders}
                        color="green"
                    />
                    <StatCard
                        icon="👥"
                        title="Total Usuarios"
                        value={stats.users}
                        color="purple"
                    />
                    <StatCard
                        icon="💰"
                        title="Ingresos Totales"
                        value={`$${stats.revenue.toFixed(2)}`}
                        color="orange"
                    />
                </div>

                <div className="dashboard-details">
                    <div className="detail-card">
                        <h3 className="detail-title">Estado de Pedidos</h3>
                        <div className="detail-content">
                            <div className="detail-item">
                                <span className="detail-label">Pendientes:</span>
                                <span className="detail-value badge-pending">{stats.pending}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Completados:</span>
                                <span className="detail-value badge-completed">{stats.completed}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-card">
                        <h3 className="detail-title">Últimos Pedidos</h3>
                        <div className="recent-orders">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="recent-order-item">
                                    <span className="order-id">#{order.id}</span>
                                    <span className={`order-status status-${order.status}`}>
                                        {order.status}
                                    </span>
                                    <span className="order-amount">${order.total_amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Dashboard;

