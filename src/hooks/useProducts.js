import { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';

export const useProducts = () => {
    const { supabase } = useSupabase();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todos los productos activos con sus categorías
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setProducts(data || []);
            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener productos:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener todas las categorías
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .order('nombre', { ascending: true });

            if (error) throw - error;

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

    // Obtener producto por ID
    const getProductById = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener producto:', err);
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
                .ilike('categoria', `%${categorySlug}%`)
                .order('created_at', { ascending: false });

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

    // Buscar productos por nombre o descripción
    const searchProducts = async (searchTerm) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al buscar productos:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Obtener productos destacados (featured)
    const getFeaturedProducts = async (limit = 6) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { data, error: null };
        } catch (err) {
            console.error('Error al obtener productos destacados:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Verificar disponibilidad de stock
    const checkStock = async (productId, quantity) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('stock')
                .eq('id', productId)
                .single();

            if (error) throw error;

            return {
                available: data.stock >= quantity,
                currentStock: data.stock,
                error: null
            };
        } catch (err) {
            console.error('Error al verificar stock:', err);
            return {
                available: false,
                currentStock: 0,
                error: err.message
            };
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    return {
        products,
        categories,
        loading,
        error,
        fetchProducts,
        fetchCategories,
        getProductById,
        getProductsByCategory,
        searchProducts,
        getFeaturedProducts,
        checkStock
    };
};
