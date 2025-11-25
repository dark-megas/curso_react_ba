import { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext.jsx';

export const useProducts = () => {
    const { supabase } = useSupabase();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();

        // Realtime Subscription
        const channel = supabase
            .channel('products_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                (payload) => {
                    console.log('Change received!', payload);
                    if (payload.eventType === 'INSERT') {
                        setProducts((prev) => [payload.new, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setProducts((prev) =>
                            prev.map((product) =>
                                product.id === payload.new.id ? payload.new : product
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setProducts((prev) =>
                            prev.filter((product) => product.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const createProduct = async (productData) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([productData])
                .select();
            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            return { data: null, error: err.message };
        }
    };

    const updateProduct = async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select();
            if (error) throw error;
            return { data, error: null };
        } catch (err) {
            return { data: null, error: err.message };
        }
    };

    const deleteProduct = async (id) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return { error: null };
        } catch (err) {
            return { error: err.message };
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        categories,
        createProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts,
        refreshCategories: fetchCategories
    };
};
