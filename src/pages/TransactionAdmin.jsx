import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TicketIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';

const TransactionAdmin = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, succeeded, pending, failed
  const [sortBy, setSortBy] = useState('date'); // date, amount, username
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  useEffect(() => {
    if (!auth || auth.role !== 'admin') {
      navigate('/');
      toast.error('Unauthorized access', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      });
      return;
    }

    fetchTransactions();
  }, [auth, navigate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/payments/admin/all', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(error.response?.data?.message || 'Error fetching transactions', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch (error) {
      // Fallback date formatting if date-fns fails
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit'
      };
      
      return date.toLocaleString('en-US', options);
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Filter by status
      if (filter !== 'all' && transaction.status !== filter) {
        return false;
      }
      
      // Filter by search term (payment ID, username, or description)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.paymentId?.toLowerCase().includes(searchLower) ||
          transaction.user?.username?.toLowerCase().includes(searchLower) ||
          transaction.description?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'username':
          comparison = (a.user?.username || '').localeCompare(b.user?.username || '');
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort order
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
      <Navbar />
      <div className="mx-4 h-fit rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-indigo-900">Transaction Management</h1>
          <button
            onClick={fetchTransactions}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-500" />
            </div>
            <input
              type="search"
              className="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-gray-900"
              placeholder="Search by ID, user, or description"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="filter"
              className="block w-full rounded-lg border border-gray-300 p-2 text-gray-900"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All Statuses</option>
              <option value="succeeded">Succeeded</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              className="block w-full rounded-lg border border-gray-300 p-2 text-gray-900"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="username">Username</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">{transaction.paymentId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                          {transaction.user?.username || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <CurrencyRupeeIcon className="h-4 w-4 text-gray-600" />
                          {transaction.amount?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-sm">
                        {transaction.description || 'No description'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                              transaction.status
                            )}`}
                          >
                            {transaction.status || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {transaction.ticketCount > 0 ? (
                          <div className="flex items-center gap-1">
                            <TicketIcon className="h-4 w-4 text-indigo-500" />
                            <span>{transaction.ticketCount}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No tickets</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <div className="mt-2 flex items-center">
              <CurrencyRupeeIcon className="mr-1 h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {transactions
                  .filter(t => t.status === 'succeeded')
                  .reduce((sum, t) => sum + (t.amount || 0), 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>

          {/* Successful Transactions */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Successful Payments</h3>
            <div className="mt-2 flex items-center">
              <CheckCircleIcon className="mr-1 h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                {transactions.filter(t => t.status === 'succeeded').length}
              </span>
            </div>
          </div>

          {/* Pending Transactions */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
            <div className="mt-2 flex items-center">
              <ClockIcon className="mr-1 h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">
                {transactions.filter(t => t.status === 'pending').length}
              </span>
            </div>
          </div>

          {/* Failed Transactions */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-sm font-medium text-gray-500">Failed Payments</h3>
            <div className="mt-2 flex items-center">
              <XCircleIcon className="mr-1 h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">
                {transactions.filter(t => t.status === 'failed').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionAdmin; 