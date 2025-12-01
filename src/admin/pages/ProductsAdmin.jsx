import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useCategories } from '../hooks/useCategories.js';
import GalleryManager from '../components/GalleryManager.jsx';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Image as ImageIcon,
    Save,
    Package,
    AlertCircle,
    Images
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CurrencyInput from 'react-currency-input-field';
import {toast} from "react-toastify";

function ProductsAdmin() {
    const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
    const { categories } = useCategories();

    // Estados
    const [showModal, setShowModal] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        avatar: [], // Ahora es un array de URLs
        stock: '',
        detalles: ''
    });


    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handler específico para precio con máscara
    const handleCategoryToggle = (categorySlug) => {
        setSelectedCategories(prev =>
            prev.includes(categorySlug)
                ? prev.filter(c => c !== categorySlug)
                : [...prev, categorySlug]
        );
    };

    const resetForm = () => {
        setFormData({ nombre: '', descripcion: '', precio: '', avatar: [], stock: '', detalles: '' });
        setSelectedCategories([]);
        setEditingProduct(null);
        setShowModal(false);
        setShowGallery(false);
        setError('');
        setSuccess('');
    };

    const parseAvatar = (avatarData) => {
        if (!avatarData) return [];
        if (Array.isArray(avatarData)) return avatarData;
        try {
            const parsed = JSON.parse(avatarData);
            if (Array.isArray(parsed)) return parsed;
            return [avatarData];
        } catch (e) {
            return [avatarData];
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            nombre: product.nombre || '',
            descripcion: product.descripcion || '',
            precio: product.precio || '',
            avatar: parseAvatar(product.avatar),
            stock: product.stock || '',
            detalles: product.detalles || ''
        });


        setSelectedCategories(product.categoria ? product.categoria.split(',').map(c => c.trim()) : []);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            const { error } = await deleteProduct(id);
            if (error) toast.error("Error al eliminar el producto: " + error);
            else toast.success("Producto eliminado correctamente");
        }
    };

    const validateForm = () => {
        if (!formData.nombre || formData.nombre.trim() === '') {
            return 'El nombre del producto es obligatorio.';
        }
        const price = parseFloat(formData.precio);
        if (isNaN(price) || price <= 0) {
            return 'El precio debe ser un número válido y no puede ser negativo.';
        }

        const stock = parseFloat(formData.stock);
        if (isNaN(stock) || stock <= 0 || !Number.isInteger(stock)) {
            return 'El stock debe ser un número entero válido y no puede ser negativo.';
        }

        //return "Datos válidos";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            //setError(validationError);
            toast.error("Error: " + validationError);
            return;
        }

        const productData = {
            ...formData,
            precio: parseFloat(formData.precio),
            stock: parseInt(formData.stock),
            categoria: selectedCategories.join(','),
            avatar: JSON.stringify(formData.avatar) // Guardar como JSON string
        };

        const action = editingProduct
            ? updateProduct(editingProduct.id, productData)
            : createProduct(productData);

        const { error } = await action;

        if (error) {
            //setError(error);
            toast.error("Error: " + error);
        } else {
            //setSuccess(editingProduct ? 'Producto actualizado' : 'Producto creado');
            toast.success(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
            resetForm();
        }
    };

    const handleImageSelect = (url) => {
        setFormData(prev => {
            const exists = prev.avatar.includes(url);
            if (exists) {
                return { ...prev, avatar: prev.avatar.filter(a => a !== url) };
            } else {
                return { ...prev, avatar: [...prev.avatar, url] };
            }
        });
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            avatar: prev.avatar.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Filtrado de productos
    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Inventario de Productos">
            <div className="space-y-6">

                {/* Barra de Acciones y Búsqueda */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-slate-900/20"
                    >
                        <Plus size={20} /> Nuevo Producto
                    </button>
                </div>

                {/*/!* Mensajes de Feedback *!/*/}
                {/*<AnimatePresence>*/}
                {/*    {(success || error) && (*/}
                {/*        <motion.div*/}
                {/*            initial={{ opacity: 0, y: -10 }}*/}
                {/*            animate={{ opacity: 1, y: 0 }}*/}
                {/*            exit={{ opacity: 0 }}*/}
                {/*            className={`p-4 rounded-lg flex items-center gap-2 ${success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}*/}
                {/*        >*/}
                {/*            <AlertCircle size={20} />*/}
                {/*            {success || error}*/}
                {/*        </motion.div>*/}
                {/*    )}*/}
                {/*</AnimatePresence>*/}

                {/* Tabla de Productos */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Producto</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Categoría</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Precio</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stock</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">Cargando...</td></tr>
                                ) : filteredProducts.map((product) => {
                                    const avatarList = parseAvatar(product.avatar);
                                    const mainImage = avatarList[0];
                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                        {mainImage ? (
                                                            <img src={mainImage} alt={product.nombre} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{product.nombre}</p>
                                                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{product.descripcion}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.categoria?.split(',').map((cat, i) => (
                                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                ${product.precio?.toLocaleString('es-AR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 px-2 py-1 rounded-full w-fit text-xs font-bold ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    <Package size={14} />
                                                    {product.stock}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL PROFESIONAL */}
                <AnimatePresence>
                    {showModal && (
                        <>
                            {/* Backdrop Blur */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={resetForm}
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto border border-slate-100 flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                                        <h2 className="text-xl font-bold text-slate-800">
                                            {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                                        </h2>
                                        <button onClick={resetForm} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">

                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Columna Izquierda: Imágenes */}
                                            <div className="w-full lg:w-1/3 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-semibold text-slate-700">Galería de Imágenes</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowGallery(!showGallery)}
                                                        className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-lg hover:bg-orange-100 transition-colors font-medium flex items-center gap-1"
                                                    >
                                                        <Images size={14} />
                                                        {showGallery ? 'Ocultar Galería' : 'Gestionar Galería'}
                                                    </button>
                                                </div>

                                                {/* Selector de Galería Expandible */}
                                                <AnimatePresence>
                                                    {showGallery && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden border border-orange-100 rounded-xl bg-orange-50/30"
                                                        >
                                                            <div className="p-4">
                                                                <GalleryManager
                                                                    onSelect={handleImageSelect}
                                                                    multiSelect={true}
                                                                    selectedImages={formData.avatar}
                                                                />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Lista de Imágenes Seleccionadas */}
                                                <div className="grid grid-cols-3 gap-2">
                                                    {formData.avatar.map((url, index) => (
                                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                                            <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                            {index === 0 && (
                                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                                                                    Principal
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowGallery(true)}
                                                        className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-orange-400 hover:text-orange-500 transition-colors bg-slate-50"
                                                    >
                                                        <Plus size={20} />
                                                        <span className="text-[10px] mt-1">Agregar</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Columna Derecha: Datos */}
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto <span className="text-red-500">*</span></label>
                                                    <input
                                                        name="nombre"
                                                        value={formData.nombre}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                                        placeholder="Ej: Collar de Cuero Premium"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Precio <span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <CurrencyInput
                                                                id="precio"
                                                                name="precio"
                                                                placeholder="0.00"
                                                                defaultValue={formData.precio}
                                                                decimalsLimit={2}
                                                                onValueChange={(value) => {
                                                                    setFormData({ ...formData, precio: value });
                                                                }}
                                                                prefix="$"
                                                                className="w-full pl-7 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-1">Se guardará como: {formData.precio}</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Stock <span className="text-red-500">*</span></label>
                                                        <input
                                                            type="number"
                                                            name="stock"
                                                            value={formData.stock}
                                                            onChange={handleChange}
                                                            required
                                                            min="0"
                                                            step="1"
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción Corta</label>
                                                        <textarea
                                                            name="descripcion"
                                                            value={formData.descripcion}
                                                            onChange={handleChange}
                                                            rows="3"
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Detalles Técnicos</label>
                                                        <textarea
                                                            name="detalles"
                                                            value={formData.detalles}
                                                            onChange={handleChange}
                                                            rows="3"
                                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Selector de Categorías */}
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-3">Categorías</label>
                                                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                        {categories.map((cat) => {
                                                            const isSelected = selectedCategories.includes(cat.slug);
                                                            return (
                                                                <button
                                                                    key={cat.id}
                                                                    type="button"
                                                                    onClick={() => handleCategoryToggle(cat.slug)}
                                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${isSelected
                                                                        ? 'bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20'
                                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                                                                        }`}
                                                                >
                                                                    {cat.nombre}
                                                                </button>
                                                            );
                                                        })}
                                                        {categories.length === 0 && <span className="text-sm text-slate-400">No hay categorías disponibles.</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-slate-900/20 flex items-center gap-2"
                                            >
                                                <Save size={18} />
                                                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}

export default ProductsAdmin;