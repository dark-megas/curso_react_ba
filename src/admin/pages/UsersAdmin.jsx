import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useUsers } from '../hooks/useUsers.js';

function UsersAdmin() {
    const { users, loading, getUserOrders } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const handleViewUser = async (user) => {
        setSelectedUser(user);
        setLoadingOrders(true);
        const { data } = await getUserOrders(user.id);
        setUserOrders(data || []);
        setLoadingOrders(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AdminLayout title="Gestión de Usuarios">
            <div className="admin-users-container">
                {loading ? (
                    <div className="admin-loading">Cargando usuarios...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Nombre</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Fecha Registro</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="user-id-cell">{user.id.substring(0, 8)}...</td>
                                        <td>{user.email}</td>
                                        <td>{user.nombre || 'N/A'}</td>
                                        <td>{user.telefono || 'N/A'}</td>
                                        <td>
                                            <span className={`role-badge role-${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td>
                                            <button
                                                className="btn-view"
                                                onClick={() => handleViewUser(user)}
                                            >
                                                👁️ Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="empty-state">
                                No hay usuarios registrados
                            </div>
                        )}
                    </div>
                )}

                {/* Modal de detalles de usuario */}
                {selectedUser && (
                    <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                        <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Detalle del Usuario</h2>
                                <button className="modal-close" onClick={() => setSelectedUser(null)}>✕</button>
                            </div>

                            <div className="user-details">
                                <div className="user-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{selectedUser.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Nombre:</span>
                                        <span className="info-value">{selectedUser.nombre || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Teléfono:</span>
                                        <span className="info-value">{selectedUser.telefono || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Dirección:</span>
                                        <span className="info-value">{selectedUser.direccion || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Rol:</span>
                                        <span className={`role-badge role-${selectedUser.role}`}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Fecha de registro:</span>
                                        <span className="info-value">{formatDate(selectedUser.created_at)}</span>
                                    </div>
                                </div>

                                <div className="user-orders-section">
                                    <h3>Historial de Pedidos ({userOrders.length})</h3>
                                    {loadingOrders ? (
                                        <div className="admin-loading">Cargando pedidos...</div>
                                    ) : userOrders.length > 0 ? (
                                        <table className="order-items-table">
                                            <thead>
                                                <tr>
                                                    <th>ID Pedido</th>
                                                    <th>Fecha</th>
                                                    <th>Estado</th>
                                                    <th>Total</th>
                                                    <th>Items</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {userOrders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td>#{order.id}</td>
                                                        <td>{formatDate(order.created_at)}</td>
                                                        <td>
                                                            <span className={`status-badge status-${order.status}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td>${order.total_amount}</td>
                                                        <td>{order.order_items?.length || 0}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="empty-state">
                                            Este usuario no tiene pedidos
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn-cancel"
                                    onClick={() => setSelectedUser(null)}
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

export default UsersAdmin;

