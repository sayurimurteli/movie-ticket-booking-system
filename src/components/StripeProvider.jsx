import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';

// Load Stripe with the publishable key
const stripePromise = loadStripe('pk_test_51R0j0E09hJeefO8NtokMNpJLksOGndi71MXFr2IwBRBV1Wjn1WuRy5f6pHhRMW9tIZCoVM5UapxyVlEBAIrrmNcz00KqCI6aIc');

const StripeProvider = ({ children, clientSecret }) => {
  const [options, setOptions] = useState({
    clientSecret: null,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#4f46e5', // indigo-600
        colorBackground: '#ffffff',
        colorText: '#1e293b', // slate-800
        colorDanger: '#ef4444', // red-500
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  });

  useEffect(() => {
    if (clientSecret) {
      setOptions(prev => ({
        ...prev,
        clientSecret
      }));
    }
  }, [clientSecret]);

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider; 