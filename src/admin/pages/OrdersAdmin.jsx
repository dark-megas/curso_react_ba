import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useOrders } from '../hooks/useOrders.js';
import {
    Search,
    Eye,
    X,
    Clock,
    Package,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    DollarSign,
    Filter,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function OrdersAdmin() {
    const { orders, loading, updateOrderStatus } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Formateadores
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // Configuración de Estados (Colores e Iconos)
    const statusConfig = {
        pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
        processing: { label: 'En Proceso', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
        completed: { label: 'Completado', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
        cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setError('');
        setSuccess('');
        const { error } = await updateOrderStatus(orderId, newStatus);
        if (error) setError(error);
        else setSuccess('Estado actualizado');
    };

    // Lógica de Filtrado
    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch =
            order.id.toString().includes(searchTerm) ||
            order.user_id?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <AdminLayout title="Gestión de Pedidos">
            <div className="space-y-6">

                {/* Barra de Herramientas: Buscador y Tabs de Filtro */}
                <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">

                    {/* Buscador */}
                    <div className="relative w-full xl:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por ID de pedido o usuario..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Tabs de Filtros */}
                    <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                        {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === status
                                        ? 'bg-slate-800 text-white shadow-md'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {status === 'all' ? 'Todos' : statusConfig[status]?.label || status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabla de Pedidos */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pedido</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Usuario</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Detalles</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-slate-500">Cargando pedidos...</td></tr>
                                ) : filteredOrders.map((order) => {
                                    const StatusIcon = statusConfig[order.status]?.icon || Clock;
                                    return (
                                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-mono text-sm font-medium text-slate-700">
                                                #{order.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <User size={16} className="text-slate-400" />
                                                    <span title={order.user_id} className="truncate max-w-[120px]">
                                                        {order.user_id.substring(0, 8)}...
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="relative group w-fit">
                                                    {/* Badge Visual */}
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${statusConfig[order.status]?.color}`}>
                                                        <StatusIcon size={14} />
                                                        {statusConfig[order.status]?.label}
                                                        <ChevronDown size={12} className="opacity-50" />
                                                    </div>

                                                    {/* Selector Oculto (Nativo pero estilizado invisible encima) */}
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    >
                                                        <option value="pending">Pendiente</option>
                                                        <option value="processing">En Proceso</option>
                                                        <option value="completed">Completado</option>
                                                        <option value="cancelled">Cancelado</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {formatCurrency(order.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && !loading && (
                            <div className="p-12 text-center text-slate-400">
                                No se encontraron pedidos con estos filtros.
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL DE DETALLES (FACTURA) */}
                <AnimatePresence>
                    {selectedOrder && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setSelectedOrder(null)}
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto border border-slate-100 flex flex-col">

                                    {/* Modal Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                                Pedido #{selectedOrder.id}
                                            </h2>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Realizado el {formatDate(selectedOrder.created_at)}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${statusConfig[selectedOrder.status]?.color}`}>
                                            {statusConfig[selectedOrder.status]?.label}
                                        </div>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-500 mb-2">
                                                    <User size={16} /> <span className="text-xs font-bold uppercase">Cliente</span>
                                                </div>
                                                <p className="font-mono text-sm text-slate-700 truncate">{selectedOrder.user_id}</p>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-2 text-slate-500 mb-2">
                                                    <DollarSign size={16} /> <span className="text-xs font-bold uppercase">Total</span>
                                                </div>
                                                <p className="font-bold text-xl text-slate-800">{formatCurrency(selectedOrder.total_amount)}</p>
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                                <Package size={16} /> Productos ({selectedOrder.order_items?.length || 0})
                                            </h3>
                                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-slate-50 text-slate-500">
                                                        <tr>
                                                            <th className="px-4 py-3 font-medium">Producto</th>
                                                            <th className="px-4 py-3 font-medium text-center">Cant.</th>
                                                            <th className="px-4 py-3 font-medium text-right">Precio</th>
                                                            <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {selectedOrder.order_items?.map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                                    {item.product?.nombre || <span className="text-red-400 italic">Producto eliminado</span>}
                                                                </td>
                                                                <td className="px-4 py-3 text-center text-slate-600">x{item.quantity}</td>
                                                                <td className="px-4 py-3 text-right text-slate-600">${item.unit_price}</td>
                                                                <td className="px-4 py-3 text-right font-bold text-slate-700">
                                                                    ${(item.quantity * item.unit_price).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="p-4 border-t border-slate-100 flex justify-end">
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="px-6 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}

export default OrdersAdmin;