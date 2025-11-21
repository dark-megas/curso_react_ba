import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useCategories } from '../hooks/useCategories.js';

function CategoriesAdmin() {
    const { categories, loading, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useCategories();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        slug: '',
        image: '',
        status: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const categoryData = {
            nombre: formData.nombre,
            slug: formData.slug || formData.nombre.toLowerCase().replace(/\s+/g, '-'),
            image: formData.image,
            status: formData.status
        };

        if (editingCategory) {
            const { error } = await updateCategory(editingCategory.id, categoryData);
            if (error) {
                setError(error);
            } else {
                setSuccess('Categoría actualizada correctamente');
                resetForm();
            }
        } else {
            const { error } = await createCategory(categoryData);
            if (error) {
                setError(error);
            } else {
                setSuccess('Categoría creada correctamente');
                resetForm();
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            nombre: category.nombre || '',
            slug: category.slug || '',
            image: category.image || '',
            status: category.status
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de desactivar esta categoría?')) {
            const { error } = await deleteCategory(id, false);
            if (error) {
                setError(error);
            } else {
                setSuccess('Categoría desactivada correctamente');
            }
        }
    };

    const handleToggleStatus = async (id) => {
        const { error } = await toggleCategoryStatus(id);
        if (error) {
            setError(error);
        } else {
            setSuccess('Estado actualizado correctamente');
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            slug: '',
            image: '',
            status: true
        });
        setEditingCategory(null);
        setShowModal(false);
    };

    return (
        <AdminLayout title="Gestión de Categorías">
            <div className="admin-categories-container">
                <div className="admin-actions-bar">
                    <button
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        ➕ Nueva Categoría
                    </button>
                </div>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                {loading ? (
                    <div className="admin-loading">Cargando categorías...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Slug</th>
                                    <th>Estado</th>
                                    <th>Creada</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.nombre}
                                                    className="product-thumb"
                                                />
                                            ) : (
                                                <span className="no-image">Sin imagen</span>
                                            )}
                                        </td>
                                        <td>{category.nombre}</td>
                                        <td className="user-id-cell">{category.slug}</td>
                                        <td>
                                            <button
                                                className={`status-toggle ${category.status ? 'active' : 'inactive'}`}
                                                onClick={() => handleToggleStatus(category.id)}
                                            >
                                                {category.status ? '✓ Activa' : '✗ Inactiva'}
                                            </button>
                                        </td>
                                        <td>{new Date(category.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(category)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {categories.length === 0 && (
                            <div className="empty-state">
                                No hay categorías registradas
                            </div>
                        )}
                    </div>
                )}

                {/* Modal de crear/editar */}
                {showModal && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                                <button className="modal-close" onClick={resetForm}>✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre *</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Ej: Alimentos"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="slug">Slug (URL amigable)</label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Se genera automáticamente si se deja vacío"
                                    />
                                    <small className="form-help">Solo letras minúsculas, números y guiones</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="image">URL de Imagen</label>
                                    <input
                                        type="text"
                                        id="image"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="status"
                                            checked={formData.status}
                                            onChange={handleChange}
                                            className="form-checkbox"
                                        />
                                        <span>Categoría activa</span>
                                    </label>
                                </div>

                                <div className="modal-actions">
                                    <button type="submit" className="btn-submit">
                                        {editingCategory ? 'Actualizar' : 'Crear'}
                                    </button>
                                    <button type="button" className="btn-cancel" onClick={resetForm}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default CategoriesAdmin;

