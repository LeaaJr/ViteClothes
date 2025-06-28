import React, { useState, useContext } from "react";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import styles from '../style/Checkout.module.css';
import logolm from '../style/logos/lm.png'
import { useCart } from '../context/CartContext';


const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, getTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    email: '',
    city: '',
    strada: ''
  });

  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const total = getTotal();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName) newErrors.companyName = "El nombre es obligatorio.";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido.";
    }
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Teléfono inválido (10 dígitos).";
    }
    if (!formData.city) newErrors.city = "Ciudad obligatoria.";
    if (!formData.strada) newErrors.strada = "Dirección obligatoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !validateForm()) {
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      // 1. Crear un PaymentIntent en el backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Stripe usa centavos
          currency: 'eur',
          metadata: {
            customer_name: formData.companyName,
            customer_email: formData.email,
            products: JSON.stringify(cartItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price // Asegurarse de que el precio está incluido
            })))
          }
        }),
      });

      const { clientSecret } = await response.json();

      // 2. Confirmar el pago con Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formData.companyName,
            email: formData.email,
            phone: formData.phone,
            address: {
              city: formData.city,
              line1: formData.strada
            }
          }
        }
      });

      if (stripeError) {
        setPaymentError(stripeError.message);
        setProcessing(false);
        return;
      }

      // 3. Pago exitoso
      if (paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        clearCart();
        
        await fetch('/api/save-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
            customer: formData,
            items: cartItems
          }),
        });
      }
    } catch (err) {
      setPaymentError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const parsePrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const cleaned = price.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

  if (paymentSuccess) {
    return (
      <div className={styles.successMessage}>
        <h2>Payment successful!</h2>
        <p>Thank you for your purchase. We have sent a receipt to {formData.email}.</p>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formSection}>
        <div className={styles.logo}>
          <img src={logolm} alt="Logo" />
        </div>
        <h1 className={styles.title}>Shipping and payment details</h1>
        
        <div className={styles.form}>
          {/* Campos del formulario de envío */}
          <div className={styles.inputGroup}>
            <label htmlFor="companyName" className={styles.label}>Full name*</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className={styles.input}
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            {errors.companyName && <p className={styles.error}>{errors.companyName}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>Phone*</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="city" className={styles.label}>City*</label>
            <input
              type="text"
              id="city"
              name="city"
              className={styles.input}
              value={formData.city}
              onChange={handleChange}
              required
            />
            {errors.city && <p className={styles.error}>{errors.city}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="strada" className={styles.label}>Address*</label>
            <input
              type="text"
              id="strada"
              name="strada"
              className={styles.input}
              value={formData.strada}
              onChange={handleChange}
              required
            />
            {errors.strada && <p className={styles.error}>{errors.strada}</p>}
          </div>

          {/* Sección de pago con Stripe */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Card details*</label>
            <div className={styles.cardElement}>
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className={styles.summary}>
            <h3>Order Summary</h3>
            <ul className={styles.summaryList}>
              {cartItems.map(item => (
                <li key={`${item.id}-${item.size || ''}`} className={styles.summaryItem}>
                  <span>{item.name} {item.size && `(Talla: ${item.size})`} x{item.quantity}</span>
                  <span>€{(parsePrice(item.price) * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span>€{getTotal().toFixed(2)}</span>
            </div>
          </div>

          {paymentError && <div className={styles.error}>{paymentError}</div>}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={processing || !stripe || cartItems.length === 0}
          >
            {processing ? 'Procesando...' : `Pagar €${total.toFixed(2)}`}
          </button>
        </div>
      </form>
      <div className={styles.imageSection}>
              <img
                src="https://static.zara.net/assets/public/0556/08f6/62cb48a19e46/ddf4a0cf3ef3/T0070628101-p/T0070628101-p.jpg?ts=1745585444830&w=628"
                alt="ZARA fashion model"
                className={styles.fashionImage}
              />
            </div>
    </section>
  );
};

export default Checkout;