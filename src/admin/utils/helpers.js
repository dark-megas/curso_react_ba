/**
 * Utilidades para el panel de administración
 */

/**
 * Formatea un número como moneda
 * @param {number} amount - Monto a formatear
 * @param {string} currency - Código de moneda (default: 'ARS')
 * @returns {string} - Monto formateado
 */
export const formatCurrency = (amount, currency = 'ARS') => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Formatea una fecha
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date, locale = 'es-ES') => {
    return new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Formatea una fecha con hora
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale (default: 'es-ES')
 * @returns {string} - Fecha y hora formateadas
 */
export const formatDateTime = (date, locale = 'es-ES') => {
    return new Date(date).toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Obtiene el color del estado de un pedido
 * @param {string} status - Estado del pedido
 * @returns {string} - Clase CSS para el color
 */
export const getOrderStatusColor = (status) => {
    const colors = {
        pending: 'status-pending',
        processing: 'status-processing',
        completed: 'status-completed',
        cancelled: 'status-cancelled',
    };
    return colors[status] || 'status-default';
};

/**
 * Obtiene la etiqueta en español del estado
 * @param {string} status - Estado del pedido
 * @returns {string} - Etiqueta en español
 */
export const getOrderStatusLabel = (status) => {
    const labels = {
        pending: 'Pendiente',
        processing: 'En Proceso',
        completed: 'Completado',
        cancelled: 'Cancelado',
    };
    return labels[status] || status;
};

/**
 * Valida si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Trunca un texto largo
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima (default: 50)
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Calcula el total de un pedido
 * @param {Array} items - Items del pedido
 * @returns {number} - Total calculado
 */
export const calculateOrderTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((total, item) => {
        return total + (item.quantity * item.unit_price);
    }, 0);
};

/**
 * Formatea un número con separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} - Número formateado
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat('es-AR').format(num);
};

/**
 * Obtiene el icono del rol de usuario
 * @param {string} role - Rol del usuario
 * @returns {string} - Icono emoji
 */
export const getRoleIcon = (role) => {
    const icons = {
        admin: '👑',
        user: '👤',
    };
    return icons[role] || '👤';
};

/**
 * Valida si un valor es numérico
 * @param {any} value - Valor a validar
 * @returns {boolean} - True si es numérico
 */
export const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Genera un ID único temporal
 * @returns {string} - ID único
 */
export const generateTempId = () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Descarga datos como archivo CSV
 * @param {Array} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportToCSV = (data, filename = 'export.csv') => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header =>
                JSON.stringify(row[header] || '')
            ).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} - Función con debounce
 */
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

