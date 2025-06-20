import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import styles from '../style/ShoppingCart.module.css';

const ShoppingCart = ({ open, onClose }) => {
  // Keep this log for a moment to see the effect after the fix
  console.log('ShoppingCart received open prop (before !!):', open, 'Type:', typeof open);

  const { cartItems, removeFromCart, getTotal } = useCart();
  const subtotal = getTotal();
  const formattedTotal = isNaN(subtotal) ? '0.00' : subtotal.toFixed(2);

  const handleRemoveItem = (itemId, size) => {
    removeFromCart(itemId, size);
  };

  return (
    // THIS IS THE CRITICAL CHANGE: Force 'open' to be a boolean
    <Dialog open={!!open} onClose={onClose} className={styles.dialog}>
      <DialogBackdrop className={styles.dialogBackdrop} />

      <div className={styles.outerContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.panelContainer}>
            <DialogPanel className={styles.dialogPanel}>
              <div className={styles.panelContent}>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <DialogTitle className={styles.headerTitle}>
                      Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                    </DialogTitle>
                    <button
                      type="button"
                      onClick={onClose}
                      className={styles.closeButton}
                      aria-label="Close cart"
                    >
                      <XMarkIcon className={styles.xMarkIcon} />
                    </button>
                  </div>

                  <div className={styles.cartList}>
                    {cartItems.length === 0 ? (
                      <p className={styles.emptyCartText}>Your cart is empty</p>
                    ) : (
                      <ul className={styles.cartItemsList}>
                        {cartItems.map((item) => (
                          <li key={`<span class="math-inline">\{item\.id\}\-</span>{item.size || ''}`} className={styles.cartItem}>
                            <div className={styles.cartImage}>
                              <img
                                src={item.imageSrc}
                                alt={item.imageAlt || item.name}
                                className={styles.cartImageImg}
                              />
                            </div>
                            <div className={styles.cartDetails}>
                              <div className={styles.cartItemHeader}>
                                <h3 className={styles.itemName}>
                                  {item.name}
                                </h3>
                                <p className={styles.cartItemPrice}>
                                  {item.price.toString().includes('€')
                                    ? item.price
                                    : `€${item.price}`.replace('$', '')}
                                </p>
                              </div>
                              <div className={styles.itemDetails}>
                                <p className={styles.cartItemQuantity}>
                                  Quantity: {item.quantity}
                                </p>
                                {item.size && (
                                  <p className={styles.cartItemSize}>
                                    Size: {item.size}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id, item.size)}
                                className={styles.removeButton}
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {cartItems.length > 0 && (
                  <div className={styles.subtotal}>
                    <div className={styles.subtotalText}>
                      <p>Subtotal</p>
                      <p>€{formattedTotal}</p>
                    </div>
                    <p className={styles.shippingText}>
                      Shipping and taxes calculated at checkout.
                    </p>
                    <Link
                      to="/Checkout"
                      className={styles.checkoutButton}
                      onClick={onClose}
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ShoppingCart;