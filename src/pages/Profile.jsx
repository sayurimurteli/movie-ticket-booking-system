import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { UserIcon, TicketIcon, CreditCardIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import PaymentHistory from '../components/PaymentHistory';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user info
        const userResponse = await axios.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setUserInfo(userResponse.data.data);

        // Fetch tickets
        const ticketsResponse = await axios.get('/auth/tickets', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setTickets(ticketsResponse.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error fetching user data', {
          position: 'top-center',
          autoClose: 2000,
          pauseOnHover: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (auth?.token) {
      fetchUserData();
    }
  }, [auth?.token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-900 to-blue-500">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <ArrowPathIcon className="h-12 w-12 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-900 to-blue-500 pb-8">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-3xl font-bold text-white">My Dashboard</h1>

        {/* User Info */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 flex items-center text-xl font-bold">
            <UserIcon className="mr-2 h-6 w-6 text-indigo-600" />
            User Information
          </h2>
          {userInfo && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-gray-600">Username:</p>
                <p className="font-semibold">{userInfo.username}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-semibold">{userInfo.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Role:</p>
                <p className="font-semibold capitalize">{userInfo.role}</p>
              </div>
              <div>
                <p className="text-gray-600">Member Since:</p>
                <p className="font-semibold">{formatDate(userInfo.createdAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <PaymentHistory />

        {/* Tickets */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 flex items-center text-xl font-bold">
            <TicketIcon className="mr-2 h-6 w-6 text-indigo-600" />
            My Tickets
          </h2>
          
          {tickets.length === 0 ? (
            <p className="py-4 text-center text-gray-600">No tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Movie</th>
                    <th className="px-4 py-2">Seats</th>
                    <th className="px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{ticket.showtime?.showtime ? formatDate(ticket.showtime.showtime) : 'N/A'}</td>
                      <td className="px-4 py-2">{ticket.showtime?.movie?.name || 'N/A'}</td>
                      <td className="px-4 py-2">
                        {ticket.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                      </td>
                      <td className="px-4 py-2">
                        {ticket.amount ? `₹${ticket.amount.toFixed(2)}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 