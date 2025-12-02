import {useEffect} from 'react'
import {AppProvider, useAppContext} from "./context/AppContext.jsx";
import {SupabaseProvider, useSupabase} from "./context/SupabaseContext.jsx";
import {AdminAuthProvider} from "./admin/context/AdminAuthContext.jsx";
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
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import ProductsAdmin from "./admin/pages/ProductsAdmin.jsx";
import CategoriesAdmin from "./admin/pages/CategoriesAdmin.jsx";
import OrdersAdmin from "./admin/pages/OrdersAdmin.jsx";
import UsersAdmin from "./admin/pages/UsersAdmin.jsx";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute.jsx";
import FallbackMeli from "./components/FallbackMeli.jsx";
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';

// Componente de ruta protegida
function ProtectedRoute({children}) {
    const {isAuthenticated} = useSupabase();
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
    const {logout} = useSupabase();
    const {clearCart} = useAppContext();

    useEffect(() => {
        clearCart();
        logout();
    }, [logout]);

    return <Navigate to="/"/>;
}

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log('Scroll to top on route change');
    }, [pathname]);

    return null;
}

function AppRoutes() {
    const {loadingProductos} = useAppContext();

    return (
        <>
            <ScrollToTop />
            {loadingProductos ? (
                <Loader message="Cargando aplicación..."/>
            ) : (
                <Routes>
                    <Route path="/" element={
                        <Layout title="Inicio">
                            <Home/>
                        </Layout>}/>

                    <Route path="/login" element={
                        <Layout title="Iniciar Sesión">
                            <Login/>
                        </Layout>}/>

                    <Route path="/register" element={
                        <Layout title="Registrarse">
                            <Register/>
                        </Layout>}/>

                    <Route path="/products" element={
                        <Layout title="Productos">
                            <Products/>
                        </Layout>}/>

                    <Route path="/product/:id" element={
                        <Layout title="Detalle del Producto">
                            <Product/>
                        </Layout>
                    }/>

                    <Route path="/profile" element={
                        <Layout title="Perfil">
                            <ProtectedRoute>
                                <Profile/>
                            </ProtectedRoute>
                        </Layout>
                    }/>

                    <Route path="/checkout" element={
                        <Layout title="Checkout">
                            <ProtectedRoute>
                                <Checkout/>
                            </ProtectedRoute>
                        </Layout>
                    }/>

                    <Route path="/meli/success" element={
                        <Layout title="Success">
                            <ProtectedRoute>
                                <FallbackMeli status="success"/>
                            </ProtectedRoute>
                        </Layout>
                    }/>

                    <Route path="/meli/failure" element={
                        <Layout title="Failure">
                            <ProtectedRoute>
                                <FallbackMeli status="failure"/>
                            </ProtectedRoute>
                        </Layout>
                    }/>

                    <Route path="/meli/pending" element={
                        <Layout title="Pending">
                            <ProtectedRoute>
                                <FallbackMeli status="pending"/>
                            </ProtectedRoute>
                        </Layout>
                    }/>

                    <Route path="/contact"
                           element={
                               <Layout title="Contacto">
                                   <Contact/>
                               </Layout>
                           }/>

                    <Route path="*"
                           element={
                               <Layout title="Página no encontrada">
                                   <h1>404 Not Found</h1>
                               </Layout>
                           }/>

                    {/*Logout*/}
                    <Route path="/logout" element={
                        <Layout title="Logout">
                            <Logout/>

                            <h1>Has cerrado sesión</h1>
                        </Layout>
                    }/>

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin/>}/>

                    <Route path="/admin/dashboard" element={
                        <AdminProtectedRoute>
                            <Dashboard/>
                        </AdminProtectedRoute>
                    }/>

                    <Route path="/admin/products" element={
                        <AdminProtectedRoute>
                            <ProductsAdmin/>
                        </AdminProtectedRoute>
                    }/>

                    <Route path="/admin/categories" element={
                        <AdminProtectedRoute>
                            <CategoriesAdmin/>
                        </AdminProtectedRoute>
                    }/>

                    <Route path="/admin/orders" element={
                        <AdminProtectedRoute>
                            <OrdersAdmin/>
                        </AdminProtectedRoute>
                    }/>

                    <Route path="/admin/users" element={
                        <AdminProtectedRoute>
                            <UsersAdmin/>
                        </AdminProtectedRoute>
                    }/>

                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace/>}/>

                </Routes>
            )}
        </>
    )
}

function App() {
    return (
        <SupabaseProvider>
            <AdminAuthProvider>
                <AppProvider>
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"/>
                        <AppRoutes/>
                </AppProvider>

            </AdminAuthProvider>
        </SupabaseProvider>
    )
}

export default App;

