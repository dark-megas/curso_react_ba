import {useEffect} from 'react'
import {AppProvider, useAppContext} from "./context/AppContext.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Products from "./pages/Products.jsx";
import Product from "./pages/Product.jsx";
import Home from "./pages/Home.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contact from "./pages/Contact.jsx";
import Loader from "./components/Loader.jsx";
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'

// Componente de ruta protegida
function ProtectedRoute({children}) {
    const {isAuthenticated} = useAppContext();
    const location = useLocation();

    //Si tiene productos en el carrito y no está autenticado, redirige a registro
    if (location.pathname === '/checkout' && !isAuthenticated) {
        return <Navigate to="/register" replace/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    return children;
}

function Logout() {
    const {setIsAuthenticated, setUsuario} = useAppContext();

    useEffect(() => {
        setIsAuthenticated(false);
        setUsuario({nombre: "", email: "", telefono: "", direccion: ""});
    }, [setIsAuthenticated, setUsuario]);

    return null;
}

function AppRoutes() {
    const { loadingProductos } = useAppContext();

    return (
        <>
            {loadingProductos ? (
                <Loader message="Cargando aplicación..."/>
            ) : (
                <Routes>
                    <Route path="/" element={
                        <Layout  title="Inicio">
                            <Home/>
                        </Layout>}/>

                    <Route path="/login" element={
                        <Layout  title="Iniciar Sesión">
                            <Login/>
                        </Layout>}/>

                    <Route path="/register" element={
                        <Layout  title="Registrarse">
                            <Register/>
                        </Layout>}/>

                    <Route path="/products" element={
                        <Layout  title="Productos">
                            <Products/>
                        </Layout>}/>

                    <Route path="/product/:id" element={
                        <Layout  title="Detalle del Producto">
                            <Product/>
                        </Layout>
                    }/>

                    <Route path="/profile" element={
                        <Layout  title="Perfil">
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        </Layout>
                    }/>

                    <Route path="/checkout" element={
                        <Layout  title="Checkout">
                            <ProtectedRoute>
                                <Checkout/>
                            </ProtectedRoute>
                        </Layout>
                    }/>

                    <Route path="/contact"
                           element={
                        <Layout  title="Contacto">
                            <Contact/>
                        </Layout>
                    }/>

                    <Route path="*"
                           element={
                            <Layout  title="Página no encontrada">
                                <h1>404 Not Found</h1>
                           </Layout>
                    }/>

                    {/*Logout*/}
                    <Route path="/logout" element={
                        <Layout  title="Logout">
                            <Logout/>
                            <h1>Has cerrado sesión</h1>
                        </Layout>
                    }/>

                </Routes>
            )}
        </>
    )
}

function App() {
    return (
        <AppProvider>
            <AppRoutes/>
        </AppProvider>
    )
}

export default App;

