import React, {useState} from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import {useProducts} from '../hooks/useProducts.js';
import {useCategories} from '../hooks/useCategories.js';

function ProductsAdmin() {
    const {products, loading, createProduct, updateProduct, deleteProduct} = useProducts();
    const {categories} = useCategories();
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        avatar: '',
        stock: '',
        detalles: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const productData = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: parseFloat(formData.precio),
            avatar: formData.avatar,
            categoria: selectedCategories.join(','), // Unir categorías con comas
            stock: parseFloat(formData.stock),
            detalles: formData.detalles
        };

        if (editingProduct) {
            const {error} = await updateProduct(editingProduct.id, productData);
            if (error) {
                setError(error);
            } else {
                setSuccess('Producto actualizado correctamente');
                resetForm();
            }
        } else {
            const {error} = await createProduct(productData);
            if (error) {
                setError(error);
            } else {
                setSuccess('Producto creado correctamente');
                resetForm();
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            nombre: product.nombre || '',
            descripcion: product.descripcion || '',
            precio: product.precio || '',
            avatar: product.avatar || '',
            stock: product.stock || '',
            detalles: product.detalles || ''
        });
        // Convertir categorías de string a array
        setSelectedCategories(product.categoria ? product.categoria.split(',').map(c => c.trim()) : []);
        setShowModal(true);
    };

    const handleCategoryToggle = (categorySlug) => {
        setSelectedCategories(prev => {
            if (prev.includes(categorySlug)) {
                return prev.filter(c => c !== categorySlug);
            } else {
                return [...prev, categorySlug];
            }
        });
    };


    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            const {error} = await deleteProduct(id);
            if (error) {
                setError(error);
            } else {
                setSuccess('Producto eliminado correctamente');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            precio: '',
            avatar: '',
            stock: '',
            detalles: ''
        });
        setSelectedCategories([]);
        setEditingProduct(null);
        setShowModal(false);
    };

    return (
        <AdminLayout title="Gestión de Productos">
            <div className="admin-products-container">
                <div className="admin-actions-bar">
                    <button
                        className="btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        ➕ Nuevo Producto
                    </button>
                </div>

                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}

                {loading ? (
                    <div className="admin-loading">Cargando productos...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                        <img
                                            src={product.avatar}
                                            alt={product.nombre}
                                            className="product-thumb"
                                        />
                                    </td>
                                    <td>{product.nombre}</td>
                                    <td>{product.categoria}</td>
                                    <td>${product.precio}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(product)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal de crear/editar */}
                {showModal && (
                    <div className="modal-overlay" onClick={resetForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                                <button className="modal-close" onClick={resetForm}>✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        className="form-input"
                                        rows="3"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="precio">Precio</label>
                                        <input
                                            type="number"
                                            id="precio"
                                            name="precio"
                                            value={formData.precio}
                                            onChange={handleChange}
                                            step="0.01"
                                            required
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="stock">Stock</label>
                                        <input
                                            type="number"
                                            id="stock"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Categorías</label>
                                    <div className="categories-selector">
                                        {categories.map((category) => (
                                            <label key={category.id} className="checkbox-label category-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.slug)}
                                                    onChange={() => handleCategoryToggle(category.slug)}
                                                    className="form-checkbox"
                                                />
                                                <span>{category.nombre}</span>
                                            </label>
                                        ))}
                                        {categories.length === 0 && (
                                            <p className="no-categories">No hay categorías disponibles. <a
                                                href="/admin/categories">Crear categorías</a></p>
                                        )}
                                    </div>
                                    {selectedCategories.length > 0 && (
                                        <small className="form-help">
                                            Seleccionadas: {selectedCategories.join(', ')}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="avatar">URL de Imagen</label>
                                    <input
                                        type="text"
                                        id="avatar"
                                        name="avatar"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="detalles">Detalles</label>
                                    <textarea
                                        id="detalles"
                                        name="detalles"
                                        value={formData.detalles}
                                        onChange={handleChange}
                                        className="form-input"
                                        rows="3"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="submit" className="btn-submit">
                                        {editingProduct ? 'Actualizar' : 'Crear'}
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

export default ProductsAdmin;

