import { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext.jsx';

export const useCategories = () => {
    const { supabase } = useSupabase();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todas las categorías activas
    const fetchCategories = async (includeInactive = false) => {
        try {
            setLoading(true);
            setError(null);

            let query = supabase
                .from('categorias')
                .select('*')
                .order('nombre', { ascending: true });

            // Filtrar solo categorías activas si no se especifica lo contrario
            if (!includeInactive) {
                query = query.eq('status', true);
            }

            const { data, error } = await query;

            if (error) throw error;

            setCategories(data || []);
            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener categorías:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener categoría por ID
    const getCategoryById = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener categoría:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener categoría por slug
    const getCategoryBySlug = async (slug) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener categoría:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Crear categoría
    const createCategory = async (categoryData) => {
        try {
            setLoading(true);
            setError(null);

            // Generar slug si no existe
            if (!categoryData.slug && categoryData.nombre) {
                categoryData.slug = generateSlug(categoryData.nombre);
            }

            const { data, error } = await supabase
                .from('categorias')
                .insert([categoryData])
                .select()
                .single();

            if (error) throw error;

            setCategories(prev => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
            return { data, error: null };
        } catch (err) {
            console.error('Error al crear categoría:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Actualizar categoría
    const updateCategory = async (id, categoryData) => {
        try {
            setLoading(true);
            setError(null);

            // Actualizar slug si se cambió el nombre
            if (categoryData.nombre && !categoryData.slug) {
                categoryData.slug = generateSlug(categoryData.nombre);
            }

            const { data, error } = await supabase
                .from('categorias')
                .update(categoryData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setCategories(prev =>
                prev.map(c => c.id === id ? data : c)
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))
            );
            return { data, error: null };
        } catch (err) {
            console.error('Error al actualizar categoría:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar categoría (soft delete - cambiar status a false)
    const deleteCategory = async (id, hardDelete = false) => {
        try {
            setLoading(true);
            setError(null);

            if (hardDelete) {
                // Eliminación permanente
                const { error } = await supabase
                    .from('categorias')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                setCategories(prev => prev.filter(c => c.id !== id));
            } else {
                // Soft delete - cambiar status a false
                const { data, error } = await supabase
                    .from('categorias')
                    .update({ status: false })
                    .eq('id', id)
                    .select()
                    .single();

                if (error) throw error;

                setCategories(prev => prev.map(c => c.id === id ? data : c));
            }

            return { error: null };
        } catch (err) {
            console.error('Error al eliminar categoría:', err);
            setError(err.message);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Activar/Desactivar categoría
    const toggleCategoryStatus = async (id) => {
        try {
            setLoading(true);
            setError(null);

            // Primero obtener el estado actual
            const category = categories.find(c => c.id === id);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }

            const { data, error } = await supabase
                .from('categorias')
                .update({ status: !category.status })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setCategories(prev => prev.map(c => c.id === id ? data : c));
            return { data, error: null };
        } catch (err) {
            console.error('Error al cambiar estado de categoría:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener productos por categoría
    const getProductsByCategory = async (categorySlug) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .ilike('categoria', `%${categorySlug}%`);

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener productos por categoría:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Función auxiliar para generar slug
    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
            .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
            .trim()
            .replace(/\s+/g, '-') // Reemplazar espacios por guiones
            .replace(/-+/g, '-'); // Eliminar guiones duplicados
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        getCategoryById,
        getCategoryBySlug,
        createCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryStatus,
        getProductsByCategory,
        generateSlug
    };
};

