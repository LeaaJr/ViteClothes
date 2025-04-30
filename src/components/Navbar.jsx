import React from 'react'
import styles from '../style/Navbar.module.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={`${styles.navLink} ${styles.active}`}>
          Home
        </Link>
        <Link to="#" className={styles.navLink}>
         About
        </Link>
        <Link to="/productos" className={styles.navLink}>
          All Products
        </Link>
        <Link to="#" className={styles.navLink}>
          Contact
        </Link>
      </div>
      <div className={styles.navCenter}>Website</div>
      <div className={styles.navRight}>
        <Link to={"/SignIn"}><button className={styles.signInButton}>Sign in</button></Link>
        <Link to={"/SignUp"}><button className={styles.signUpButton}>Sign up</button></Link>
      </div>
    </nav>
  )
}

export default Navbar