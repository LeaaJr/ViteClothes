import styles from '../style/Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import ShoppingCart from '../components/ShoppingCart';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart(); // Obtenemos los items del carrito
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setQuery('');
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setQuery('');
  };

  const scrollToSection = () => {
    const section = document.getElementById("footer");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={`${styles.navLink} ${styles.active}`}>Home</Link>
        <Link to="#" className={styles.navLink}>About</Link>
        <Link to="/productos" className={styles.navLink}>All Products</Link>
        <a onClick={scrollToSection} className={styles.navLink} style={{ cursor: 'pointer' }}>
          Contact
        </a>
      </div>
      <div className={styles.navCenter}>Website</div>
      <div className={styles.navRight}>
        {user ? (
          <div className={styles.userMenu}>
            <span className={styles.userName}>👤 {user.email}</span>
            <div className={styles.dropdown}>
              <Link to="/SavedProducts" id='SavedProducts' className={styles.dropdownItem}>Saved</Link>
              <Link to="/orders" className={styles.dropdownItem}>My orders</Link>
              <button onClick={handleLogout} className={styles.dropdownItem}>Cerrar sesión</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/SignIn"><button className={styles.signInButton}>Sign in</button></Link>
            <Link to="/SignUp"><button className={styles.signUpButton}>Sign up</button></Link>
          </>
        )}
        {/* Botón del carrito con contador */}
        <div className={styles.cartContainer}>
          <button onClick={() => setIsCartOpen(true)} className={styles.cartButton}>
          <ShoppingCartIcon className={styles.cartIcon} />
          {cartItems.length > 0 && (
            <span className={styles.cartBadge}>{cartItems.length}</span>
          )}
        </button>
        </div>
      </div>
      
      {/* Modal del carrito */}
      <ShoppingCart open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;