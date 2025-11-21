import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useOrders } from '../hooks/useOrders.js';

function OrdersAdmin() {
    const { orders, loading, updateOrderStatus } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleStatusChange = async (orderId, newStatus) => {
        setError('');
        setSuccess('');

        const { error } = await updateOrderStatus(orderId, newStatus);
        if (error) {
            setError(error);
        } else {
            setSuccess('Estado actualizado correctamente');
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            pending: 'status-pending',
            processing: 'status-processing',
            completed: 'status-completed',
            cancelled: 'status-cancelled'
        };
        return statusClasses[status] || 'status-default';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Gestión de Pedidos">
            <div className="admin-orders-container">
                <div className="admin-actions-bar">
                    <div className="filter-group">
                        <label>Filtrar por estado:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Todos</option>
                            <option value="pending">Pendientes</option>
                            <option value="processing">En Proceso</option>
                            <option value="completed">Completados</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                </div>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                {loading ? (
                    <div className="admin-loading">Cargando pedidos...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Usuario ID</th>
                                    <th>Estado</th>
                                    <th>Total</th>
                                    <th>Items</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{formatDate(order.created_at)}</td>
                                        <td className="user-id-cell">{order.user_id.substring(0, 8)}...</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="amount-cell">${order.total_amount}</td>
                                        <td>{order.order_items?.length || 0} items</td>
                                        <td>
                                            <button
                                                className="btn-view"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                👁️ Ver
                                            </button>
                                            <select
                                                className="status-select"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="processing">En Proceso</option>
                                                <option value="completed">Completado</option>
                                                <option value="cancelled">Cancelado</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredOrders.length === 0 && (
                            <div className="empty-state">
                                No hay pedidos con el filtro seleccionado
                            </div>
                        )}
                    </div>
                )}

                {/* Modal de detalles de pedido */}
                {selectedOrder && (
                    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                        <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Detalle del Pedido #{selectedOrder.id}</h2>
                                <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
                            </div>

                            <div className="order-details">
                                <div className="order-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Fecha:</span>
                                        <span className="info-value">{formatDate(selectedOrder.created_at)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Estado:</span>
                                        <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Total:</span>
                                        <span className="info-value">${selectedOrder.total_amount}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Usuario ID:</span>
                                        <span className="info-value">{selectedOrder.user_id}</span>
                                    </div>
                                </div>

                                <div className="order-items-section">
                                    <h3>Productos del Pedido</h3>
                                    <table className="order-items-table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.order_items?.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.product?.nombre || 'Producto no encontrado'}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>${item.unit_price}</td>
                                                    <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default OrdersAdmin;

