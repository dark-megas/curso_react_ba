import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductosContext = createContext();

export const useProductos = () => {
    const context = useContext(ProductosContext);
    if (!context) {
        throw new Error('useProductos debe ser usado dentro de ProductosProvider');
    }
    return context;
};

export const ProductosProvider = ({ children }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(import.meta.env.VITE_API_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error al cargar productos: ${response.status}`);
                }

                const data = await response.json();
                setProductos(data.productos || data);
            } catch (err) {
                console.error('Error fetching productos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const value = {
        productos,
        loading,
        error,
        refetch: () => {
            setLoading(true);
            setError(null);
        }
    };

    return (
        <ProductosContext.Provider value={value}>
            {children}
        </ProductosContext.Provider>
    );
};

