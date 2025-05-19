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

function App() {

  return (
    <>
    <Router>
        <Navbar />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/SignIn" element={<SignIn/>} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/productos/:id" element={<ProductDetail />} />
              <Route path="/productos/:category" element={<ProductsPage />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/SavedProducts" element={<SavedProducts />} />
          </Routes>
          <Footer id="footer" /> 
    </Router>   
    </>
  )
}

export default App
