import styles from '../style/Navbar.module.css';
import { ShoppingCart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

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
    section.scrollIntoView({ behavior: "smooth", block: "center" });
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
            <Link to="/SignIn"><ShoppingCart size={28} strokeWidth={1.5} className={styles.cart} /></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
