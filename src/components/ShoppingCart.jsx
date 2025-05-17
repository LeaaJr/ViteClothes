import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../Context/CartContext';
import { Link } from 'react-router-dom';
import styles from '../style/ShoppingCart.module.css';

const ShoppingCart = ({ open, onClose }) => {
  const { cartItems, removeFromCart, getTotal } = useCart();

  const subtotal = getTotal();
  const formattedTotal = isNaN(subtotal) ? 0 : subtotal.toFixed(2);

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog}>
      <DialogBackdrop
        transition
        className={styles.dialogBackdrop}
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className={styles.dialogPanel}
            >
              <div className={styles.panelContent}>
                <div className={styles.content}>
                  <div className={styles.header}>
                    <DialogTitle className={styles.headerTitle}>Shopping cart</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className={styles.closeButton}
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>

                  <div className={styles.cartList}>
                    {cartItems.length === 0 ? (
                      <p className="text-gray-500">No hay productos en el carrito.</p>
                    ) : (
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className={styles.cartItem}>
                            <div className={styles.cartImage}>
                              <img src={item.imageSrc} alt={item.imageAlt} className="size-full object-cover" />
                            </div>

                            <div className={styles.cartDetails}>
                              <div>
                                <div className={styles.cartItemHeader}>
                                  <h3>
                                    <a href={item.href}>{item.name}</a>
                                  </h3>
                                  <p className={styles.cartItemPrice}>{item.price}</p>
                                </div>
                                <p className={styles.cartItemQuantity}>Cantidad: {item.quantity}</p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className={styles.removeButton}
                                >
                                  Remove
                                </button>
                              </div>
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
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className={styles.checkoutButton}>
                      <Link
                        to="/Checkout"
                        className={styles.checkoutButton}
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ShoppingCart;
