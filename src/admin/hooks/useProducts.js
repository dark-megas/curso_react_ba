import { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext.jsx';

export const useProducts = () => {
    const { supabase } = useSupabase();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todos los productos
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

    // Crear producto
    const createProduct = async (productData) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (error) throw error;

            setProducts(prev => [data, ...prev]);
            return { data, error: null };
        } catch (err) {
            console.error('Error al crear producto:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Actualizar producto
    const updateProduct = async (id, productData) => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('products')
                .update(productData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setProducts(prev => prev.map(p => p.id === id ? data : p));
            return { data, error: null };
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar producto
    const deleteProduct = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(prev => prev.filter(p => p.id !== id));
            return { error: null };
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            setError(err.message);
            return { error: err.message };
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

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductById
    };
};

