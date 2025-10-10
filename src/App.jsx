import { useState, useEffect } from 'react'
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
import { Routes, Route, Navigate } from 'react-router-dom'

// Componente de ruta protegida sin usar hooks de router
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "", email: "", telefono: "", direccion: "" });
  const [cart, setCart] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Estado para productos desde la API
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState(null);

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

  return (
    <>
      {loadingProductos ? (
        <Loader message="Cargando aplicación..." />
      ) : (
        <Routes>
          <Route path="/" element={
            <Layout title="Inicio" cart={cart} setCart={setCart}>
              <Home productos={productos} loading={loadingProductos} error={errorProductos} />
            </Layout>} />
          <Route path="/login" element={
            <Layout title="Iniciar Sesión" cart={cart} setCart={setCart}>
              <Login setIsAuthenticated={setIsAuthenticated} setUsuario={setUsuario} usuarios={usuarios} />
            </Layout>} />
          <Route path="/register" element={
            <Layout title="Registrarse" cart={cart} setCart={setCart}>
              <Register usuarios={usuarios} setUsuarios={setUsuarios} />
            </Layout>} />
          <Route path="/products" element={
            <Layout title="Productos" cart={cart} setCart={setCart}>
              <Products productos={productos} loading={loadingProductos} error={errorProductos} cart={cart} setCart={setCart} />
            </Layout>} />
          <Route path="/product/:id" element={<Layout title="Detalle del Producto" cart={cart} setCart={setCart}>
            <Product productos={productos} loading={loadingProductos} error={errorProductos} cart={cart} setCart={setCart} />
          </Layout>} />
          <Route path="/profile" element={
            <Layout title="Perfil" cart={cart} setCart={setCart}>
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile usuario={usuario} setUsuario={setUsuario} />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/checkout" element={
            <Layout title="Checkout" cart={cart} setCart={setCart}>
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Checkout usuario={usuario} cart={cart} setCart={setCart} />
              </ProtectedRoute>
            </Layout>
          } />
          <Route path="/contact" element={<Layout title="Contacto" cart={cart} setCart={setCart}><Contact /></Layout>} />
          <Route path="*" element={<Layout title="Página no encontrada" cart={cart} setCart={setCart}><h1>404 Not Found</h1></Layout>} />
        </Routes>
      )}
    </>
  )
}

export default App
