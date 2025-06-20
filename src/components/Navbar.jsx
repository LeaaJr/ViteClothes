import styles from '../style/Navbar.module.css'; // Make sure this path is correct
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline'; // If you're using this for the cart icon
import ShoppingCart from '../components/ShoppingCart';
import { useCart } from '../context/CartContext';
import { HiMenu, HiOutlineX } from 'react-icons/hi'; // Hamburger icons
// import { BsCart } from 'react-icons/bs'; // If you prefer this cart icon

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth(); // Destructure isAdmin as well
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Renamed for clarity: controls desktop user menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Controls the full mobile slide-out menu

    const userMenuRef = useRef(null); // Ref for the desktop user dropdown

    // Toggle desktop user dropdown
    const handleUserMenuClick = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    // Logout function
    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false); // Close dropdown if open
        setIsMobileMenuOpen(false); // Close mobile menu if open
        navigate('/');
    };

    // Toggle mobile hamburger menu
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsUserDropdownOpen(false); // Close desktop dropdown when mobile menu opens
    };

    // Close mobile menu after navigating (for mobile links)
    const handleMobileNavLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    // Handle authentication button clicks (Sign In/Sign Up) in mobile menu
    const handleMobileAuthButtonClick = (path) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    // Close desktop user dropdown if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // Scroll to sections (assuming these are functional outside of Navbar)
    const scrollToSection = () => {
        const section = document.getElementById("footer");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setIsMobileMenuOpen(false); // Close mobile menu after clicking
    };
    const scrollToSectionTwo = () => {
        const section = document.getElementById("ParallaxSection");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setIsMobileMenuOpen(false); // Close mobile menu after clicking
    };


    return (
        <nav className={styles.navbar}>
            {/* Hamburger menu for mobile */}
            <button className={styles.hamburgerMenu} onClick={handleMobileMenuToggle}>
                {isMobileMenuOpen ? (
                    <HiOutlineX className={styles.hamburgerIcon} /> // Close icon
                ) : (
                    <HiMenu className={styles.hamburgerIcon} /> // Hamburger icon
                )}
            </button>

            {/* Desktop Nav Left - Hidden on mobile */}
            <div className={styles.navLeft}>
                <Link to="/" className={`${styles.navLink} ${styles.active}`}>Home</Link>
                <a onClick={scrollToSectionTwo} className={styles.navLink} style={{ cursor: 'pointer' }}>Trend </a>
                <Link to="/productos" className={styles.navLink}>All Products</Link>
                <a onClick={scrollToSection} className={styles.navLink} style={{ cursor: 'pointer' }}>
                    Contact
                </a>
            </div>

            {/* Nav Center - Logo/Website Title */}
            <div className={styles.navCenter}>
                <Link to="/" className={styles.navLink}></Link> {/* Keep your logo/title here */}
            </div>

            {/* Desktop Nav Right - Hidden on mobile */}
            <div className={styles.navRight}>
                {user ? (
                    <div className={styles.userMenu} ref={userMenuRef}>
                        <span
                            className={styles.userName}
                            onClick={handleUserMenuClick}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                            👤 {user.name}
                        </span>
                        <div className={`${styles.dropdown} ${isUserDropdownOpen ? styles.visible : ''}`}>
                            <Link to="/SavedProducts" className={styles.dropdownItem} onClick={() => setIsUserDropdownOpen(false)}>Saved</Link>
                            <Link to="/orders" className={styles.dropdownItem} onClick={() => setIsUserDropdownOpen(false)}>My orders</Link>
                            {user && isAdmin && ( // Only show if user is logged in AND is an admin
                                <Link to="/admin/add-product" className={styles.dropdownItem} onClick={() => setIsUserDropdownOpen(false)}>
                                    Admin Panel
                                </Link>
                            )}
                            <div className={styles.dropdownDivider}></div>
                            <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logout}`}>Cerrar sesión</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/SignIn"><button className={styles.signInButton}>Sign in</button></Link>
                        <Link to="/SignUp"><button className={styles.signUpButton}>Sign up</button></Link>
                    </>
                )}
                {/* Cart Button */}
                <div className={styles.cartContainer}>
                    <button onClick={() => setIsCartOpen(true)} className={styles.cartButton}>
                        <ShoppingCartIcon className={styles.cartIcon} /> {/* Using ShoppingCartIcon as per your code */}
                        {cartItems.length > 0 && (
                            <span className={styles.cartBadge}>{cartItems.length}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Container (conditionally rendered and styled with CSS Modules) */}
            <div className={`${styles.mobileMenuContainer} ${isMobileMenuOpen ? styles.open : ''}`}>
                <Link to="/" className={styles.mobileNavLink} onClick={handleMobileNavLinkClick}>Home</Link>
                <a onClick={scrollToSectionTwo} className={styles.mobileNavLink} style={{ cursor: 'pointer' }}>Trend </a>
                <Link to="/productos" className={styles.mobileNavLink} onClick={handleMobileNavLinkClick}>All Products</Link>
                <a onClick={scrollToSection} className={styles.mobileNavLink} style={{ cursor: 'pointer' }}>
                    Contact
                </a>
                <Link to="/Shoppingcart" className={styles.mobileNavLink} onClick={handleMobileNavLinkClick}>Shopping Cart ({cartItems.length})</Link> {/* Added cart to mobile menu */}

                <div className={styles.dropdownDivider}></div> {/* Separator for auth options */}

                {user ? (
                    <>
                        <Link to="/SavedProducts" className={styles.mobileNavLink} onClick={handleMobileNavLinkClick}>Saved</Link>
                        <Link to="/orders" className={styles.mobileNavLink} onClick={handleMobileNavLinkClick}>My orders</Link>
                        {user && isAdmin && ( // Only show if user is logged in AND is an admin
                            <Link to="/admin/add-product" className={styles.mobileNavLink} onClick={handleMobileNavLinkClick}>
                                Admin Panel
                            </Link>
                        )}
                        <button onClick={handleLogout} className={`${styles.mobileNavLink} ${styles.logout}`}>
                            Cerrar sesión ({user.name})
                        </button>
                    </>
                ) : (
                    <div className={styles.mobileAuthButtons}>
                        <button className={styles.signInButton} onClick={() => handleMobileAuthButtonClick('/SignIn')}>Sign In</button>
                        <button className={styles.signUpButton} onClick={() => handleMobileAuthButtonClick('/SignUp')}>Sign Up</button>
                    </div>
                )}
            </div>

            {/* Shopping Cart Modal */}
            <ShoppingCart open={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
};

export default Navbar;