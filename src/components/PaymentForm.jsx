import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, processing, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setStatus('processing');
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
      setStatus('error');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!');
      setStatus('success');
      onSuccess(paymentIntent);
    } else {
      setMessage('Payment status: ' + (paymentIntent?.status || 'unknown'));
      setStatus('error');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <PaymentElement />
      </div>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center ${
          status === 'success' ? 'bg-green-100 text-green-800' : 
          status === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {status === 'success' ? (
            <CheckCircleIcon className="h-5 w-5 mr-2" />
          ) : status === 'error' ? (
            <XCircleIcon className="h-5 w-5 mr-2" />
          ) : null}
          <p>{message}</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="px-4 py-2 bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-lg hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 flex items-center"
        >
          {isProcessing ? (
            <>
              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay ₹{amount.toFixed(2)}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm; 