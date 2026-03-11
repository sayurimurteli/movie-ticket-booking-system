import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CreditCardIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const PaymentHistory = () => {
  const { auth } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setIsLoading(true);
      try {
        // Get user data which includes payments
        const response = await axios.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        
        // Extract payments from user data
        if (response.data.data && response.data.data.payments) {
          setPayments(response.data.data.payments);
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
        toast.error('Error fetching payment history', {
          position: 'top-center',
          autoClose: 2000,
          pauseOnHover: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (auth?.token) {
      fetchPaymentHistory();
    }
  }, [auth?.token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <CreditCardIcon className="h-6 w-6 mr-2 text-indigo-600" />
          Payment History
        </h2>
        <p className="text-gray-600 text-center py-4">No payment history found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <CreditCardIcon className="h-6 w-6 mr-2 text-indigo-600" />
        Payment History
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment.paymentId || index} className="border-t">
                <td className="px-4 py-2">{formatDate(payment.createdAt)}</td>
                <td className="px-4 py-2">{payment.description || 'Ticket Purchase'}</td>
                <td className="px-4 py-2">₹{payment.amount ? payment.amount.toFixed(2) : '0.00'}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status || 'completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory; 