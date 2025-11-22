import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { useCategories } from '../hooks/useCategories.js';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Image as ImageIcon,
    Save,
    Power,
    AlertCircle,
    Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function CategoriesAdmin() {
    const { categories, loading, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } = useCategories();

    // Estados
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        slug: '',
        image: '',
        status: true
    });

    // Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const resetForm = () => {
        setFormData({ nombre: '', slug: '', image: '', status: true });
        setEditingCategory(null);
        setShowModal(false);
        setError('');
        setSuccess('');
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
        if (window.confirm('¿Estás seguro de eliminar esta categoría permanentemente?')) {
            const { error } = await deleteCategory(id);
            if (error) setError(error);
            else setSuccess('Categoría eliminada');
        }
    };

    const handleToggleStatus = async (id) => {
        const { error } = await toggleCategoryStatus(id);
        if (error) setError(error);
        // El estado se actualiza solo gracias al hook que recarga los datos
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Auto-generar slug si está vacío
        const categoryData = {
            ...formData,
            slug: formData.slug || formData.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        };

        const action = editingCategory
            ? updateCategory(editingCategory.id, categoryData)
            : createCategory(categoryData);

        const { error } = await action;

        if (error) {
            setError(error);
        } else {
            setSuccess(editingCategory ? 'Categoría actualizada' : 'Categoría creada');
            resetForm();
        }
    };

    // Filtrado
    const filteredCategories = categories.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Gestión de Categorías">
            <div className="space-y-6">

                {/* Barra Superior */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar categorías..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-slate-900/20"
                    >
                        <Plus size={20} /> Nueva Categoría
                    </button>
                </div>

                {/* Feedback Messages */}
                <AnimatePresence>
                    {(success || error) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-4 rounded-lg flex items-center gap-2 ${success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
                        >
                            <AlertCircle size={20} />
                            {success || error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tabla de Categorías */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Imagen</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Slug / URL</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">Cargando...</td></tr>
                                ) : filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                                {cat.image ? (
                                                    <img src={cat.image} alt={cat.nombre} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={20} className="text-slate-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {cat.nombre}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded w-fit">
                                                <LinkIcon size={12} /> /{cat.slug}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(cat.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all hover:scale-105 ${cat.status
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                            >
                                                <Power size={12} />
                                                {cat.status ? 'Activa' : 'Inactiva'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(cat)} className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredCategories.length === 0 && !loading && (
                            <div className="p-12 text-center text-slate-400">
                                No se encontraron categorías.
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL ANIMADO */}
                <AnimatePresence>
                    {showModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={resetForm}
                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto border border-slate-100">
                                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                        <h2 className="text-xl font-bold text-slate-800">
                                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                                        </h2>
                                        <button onClick={resetForm} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6 space-y-5">

                                        {/* Preview de Imagen en el Formulario */}
                                        <div className="flex justify-center mb-6">
                                            <div className="w-32 h-24 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center text-slate-400">
                                                        <ImageIcon size={24} className="mx-auto mb-1 opacity-50" />
                                                        <span className="text-[10px]">Preview</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                            <input
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                placeholder="Ej: Alimentos Secos"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (Opcional)</label>
                                            <div className="relative">
                                                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    name="slug"
                                                    value={formData.slug}
                                                    onChange={handleChange}
                                                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono text-sm text-slate-600"
                                                    placeholder="alimentos-secos"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">Se generará automáticamente si lo dejas vacío.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">URL Imagen</label>
                                            <input
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.status ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                onClick={() => setFormData({ ...formData, status: !formData.status })}>
                                                <motion.div
                                                    className="bg-white w-4 h-4 rounded-full shadow-sm"
                                                    animate={{ x: formData.status ? 16 : 0 }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">
                                                Categoría Activa (Visible en tienda)
                                            </span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                            <button type="button" onClick={resetForm} className="px-5 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors">
                                                Cancelar
                                            </button>
                                            <button type="submit" className="px-5 py-2 rounded-lg bg-slate-900 text-white hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-slate-900/20 flex items-center gap-2">
                                                <Save size={18} />
                                                {editingCategory ? 'Guardar' : 'Crear'}
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

export default CategoriesAdmin;