import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './page/Home';
import { SignIn } from './auth/SignIn';
import { SignUp } from './auth/SignUp';
import ProductsPage from './page/ProductPage';
import ProductDetail  from './page/ProductDetail';
import SavedProducts from './page/SavedProducts';
import { Footer } from './components/Footer';
/* import ShoppingCart from './components/ShoppingCart'; */
import Checkout from './page/Checkout';
import AdminProductForm from './interface/AdminProductForm';
import AdminLoginPage from './interface/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';

function App() {

  return (
    <>
<Router>
      
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignIn" element={<SignIn/>} />
          <Route path="/SignUp" element={<SignUp />} />

          {/* Rutas públicas de productos */}
          <Route path="/productos/:id" element={<ProductDetail />} /> 
          <Route path="/productos/:category" element={<ProductsPage />} /> 
          <Route path="/productos" element={<ProductsPage />} /> 
          
          <Route path="/SavedProducts" element={<SavedProducts />} />
          {/* <Route path="/Shoppingcart" element={<ShoppingCart />} /> */}
          <Route path="/Checkout" element={<Checkout />} />

          {/* Ruta para el login de adm */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Ruta protegida para agregar productos */}
          <Route 
            path="/admin/add-product" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProductForm />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer id="footer" /> 
      </AuthProvider>

    </Router>
    </>
  )
}

export default App
