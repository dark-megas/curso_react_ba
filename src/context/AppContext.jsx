import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const AppContext = createContext();

// Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe ser usado dentro de un AppProvider');
    }
    return context;
};

// Provider del contexto
export const AppProvider = ({ children }) => {
    // Estado del carrito de compras
    const [cart, setCart] = useState([]);

    // Estado para productos desde la API
    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(true);
    const [errorProductos, setErrorProductos] = useState(null);

    // Cargar productos desde la API
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoadingProductos(true);
                setErrorProductos(null);

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
                setErrorProductos(err.message);
            } finally {
                setLoadingProductos(false);
            }
        };
        fetchProductos();
    }, []);

    // Valor del contexto que se compartira
    const value = {
        cart,
        setCart,
        productos,
        loadingProductos,
        errorProductos
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;

