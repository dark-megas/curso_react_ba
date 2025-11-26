import React, { createContext, useState, useEffect, useContext } from 'react';
import { useProducts } from '../hooks/useProducts';

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

// Constante para la clave de localStorage
const CART_STORAGE_KEY = 'petstore_cart';

// Provider del contexto
export const AppProvider = ({ children }) => {
    // Usar el hook de productos
    const {
        products: productos,
        categories,
        loading: loadingProductos,
        error: errorProductos,
        fetchProducts,
        fetchCategories,
        getProductById,
        getProductsByCategory,
        searchProducts,
        getFeaturedProducts,
        checkStock
    } = useProducts();

    // Estado del carrito de compras con localStorage
    const [cart, setCartState] = useState(() => {
        // Inicializar desde localStorage
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error al cargar carrito desde localStorage:', error);
            return [];
        }
    });

    // Función para actualizar el carrito y sincronizar con localStorage
    const setCart = (newCart) => {
        try {
            // Si newCart es una función, ejecutarla con el estado actual
            const updatedCart = typeof newCart === 'function' ? newCart(cart) : newCart;

            // Actualizar estado
            setCartState(updatedCart);

            // Guardar en localStorage
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
        } catch (error) {
            console.error('Error al guardar carrito en localStorage:', error);
        }
    };

    // Función para agregar producto al carrito
    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                // Si ya existe, aumentar cantidad
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, cantidad: item.cantidad + quantity }
                        : item
                );
            } else {
                // Si no existe, agregarlo
                return [...prevCart, { ...product, cantidad: quantity }];
            }
        });
    };

    // Función para remover producto del carrito
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    // Función para actualizar cantidad de un producto
    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === productId
                        ? { ...item, cantidad: quantity }
                        : item
                )
            );
        }
    };

    // Función para limpiar el carrito
    const clearCart = () => {
        setCart([]);
    };

    // Calcular total del carrito
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    // Calcular cantidad total de items
    const getCartItemsCount = () => {
        return cart.reduce((total, item) => total + item.cantidad, 0);
    };

    // Valor del contexto que se compartirá
    const value = {
        // Productos
        productos,
        categories,
        loadingProductos,
        errorProductos,
        fetchProducts,
        fetchCategories,
        getProductById,
        getProductsByCategory,
        searchProducts,
        getFeaturedProducts,
        checkStock,

        // Carrito
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;


