// StripeProvider.jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RT4qXPbcjP3MdbImhCdPznVtEQUiBRXgYB8wOejdM399AGFrj2jcXeGn0QexlxXvQtq9MBry7TgeFh3Ig5ZTGTx00q2Zzd601');

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;