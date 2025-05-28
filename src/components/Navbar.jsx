import styles from '../style/Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import ShoppingCart from '../components/ShoppingCart';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // Estado nuevo para menú usuario
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  // Para cerrar menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = () => {
    const section = document.getElementById("footer");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const scrollToSectionTwo = () => {
  const section = document.getElementById("ParallaxSection");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};


  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={`${styles.navLink} ${styles.active}`}>Home</Link>
        <a onClick={scrollToSectionTwo} className={styles.navLink} style={{ cursor: 'pointer' }}>Trend </a>
        <Link to="/productos" className={styles.navLink}>All Products</Link>
        <a onClick={scrollToSection} className={styles.navLink} style={{ cursor: 'pointer' }}>
          Contact
        </a>
      </div>
      {/* <div className={styles.navCenter}>Website</div> */}
      <div className={styles.navRight}>
        {user ? (
          <div className={styles.userMenu} ref={menuRef}>
            <span
              className={styles.userName}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              👤 {user.name} ▼
            </span>
            {isMenuOpen && (
              <div className={styles.dropdown}>
                <Link to="/SavedProducts" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>Saved</Link>
                <Link to="/orders" className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>My orders</Link>
                <button onClick={handleLogout} className={styles.dropdownItem}>Cerrar sesión</button>
              </div>
            )}
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
