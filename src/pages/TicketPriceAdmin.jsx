import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

const TicketPriceAdmin = () => {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const [ticketPrices, setTicketPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDynamicPricingModal, setShowDynamicPricingModal] = useState(false)
  const [editingPrice, setEditingPrice] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    rowPattern: '',
    price: '',
    description: '',
    isActive: true
  })
  const [dynamicPricingData, setDynamicPricingData] = useState({
    priceId: '',
    adjustmentType: 'direct', // 'percentage', 'fixed', or 'direct'
    adjustmentValue: '',
    reason: '',
    expiresAt: '', // Optional: when the price adjustment should expire
    applyToAll: false // Whether to apply to all price categories
  })
  const [priceHistory, setPriceHistory] = useState([])
  const [showPriceHistory, setShowPriceHistory] = useState(false)

  useEffect(() => {
    if (!auth || auth.role !== 'admin') {
      navigate('/')
      toast.error('Unauthorized access', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
      return
    }

    fetchTicketPrices()
  }, [auth, navigate])

  const fetchTicketPrices = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/ticket-price/all', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      setTicketPrices(response.data.data)
    } catch (error) {
      console.error('Error fetching ticket prices:', error)
      toast.error(error.response?.data?.message || 'Error fetching ticket prices', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPriceHistory = async (priceId) => {
    try {
      const response = await axios.get(`/ticket-price/${priceId}/history`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      setPriceHistory(response.data.data)
      setShowPriceHistory(true)
    } catch (error) {
      console.error('Error fetching price history:', error)
      toast.error('Error fetching price history', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleDynamicPricingInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setDynamicPricingData({
      ...dynamicPricingData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingPrice) {
        await axios.put(`/ticket-price/${editingPrice._id}`, formData, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        })
        toast.success('Ticket price updated successfully', {
          position: 'top-center',
          autoClose: 2000,
          pauseOnHover: false
        })
      } else {
        await axios.post('/ticket-price', formData, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        })
        toast.success('Ticket price created successfully', {
          position: 'top-center',
          autoClose: 2000,
          pauseOnHover: false
        })
      }
      
      resetForm()
      fetchTicketPrices()
    } catch (error) {
      console.error('Error saving ticket price:', error)
      toast.error(error.response?.data?.message || 'Error saving ticket price', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    }
  }

  const handleDynamicPricingSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const payload = { ...dynamicPricingData };
      
      // Convert adjustment value to number
      payload.adjustmentValue = Number(payload.adjustmentValue);
      
      // If applying to all categories, remove the priceId
      if (payload.applyToAll) {
        delete payload.priceId;
      }
      
      await axios.post('/ticket-price/adjust', payload, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      toast.success('Price adjustment applied successfully', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      });
      
      resetDynamicPricingForm();
      fetchTicketPrices();
    } catch (error) {
      console.error('Error applying price adjustment:', error);
      toast.error(error.response?.data?.message || 'Error applying price adjustment', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      });
    }
  };

  const handleEdit = (price) => {
    setEditingPrice(price)
    setFormData({
      name: price.name,
      rowPattern: price.rowPattern,
      price: price.price,
      description: price.description || '',
      isActive: price.isActive
    })
    setShowModal(true)
  }

  const handleDynamicPricing = (price) => {
    setDynamicPricingData({
      priceId: price._id,
      adjustmentType: 'direct',
      adjustmentValue: price.price,
      reason: '',
      expiresAt: '',
      applyToAll: false
    });
    setShowDynamicPricingModal(true);
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket price?')) {
      return
    }
    
    try {
      await axios.delete(`/ticket-price/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      toast.success('Ticket price deleted successfully', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
      fetchTicketPrices()
    } catch (error) {
      console.error('Error deleting ticket price:', error)
      toast.error(error.response?.data?.message || 'Error deleting ticket price', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      rowPattern: '',
      price: '',
      description: '',
      isActive: true
    })
    setEditingPrice(null)
    setShowModal(false)
  }

  const resetDynamicPricingForm = () => {
    setDynamicPricingData({
      priceId: '',
      adjustmentType: 'direct',
      adjustmentValue: '',
      reason: '',
      expiresAt: '',
      applyToAll: false
    })
    setShowDynamicPricingModal(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-indigo-900 to-blue-500">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Ticket Price Management</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditingPrice(null)
                resetForm()
                setShowModal(true)
              }}
              className="flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              Add New Price
            </button>
            <button
              onClick={() => {
                resetDynamicPricingForm()
                setShowDynamicPricingModal(true)
              }}
              className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <ArrowTrendingUpIcon className="mr-2 h-5 w-5" />
              Dynamic Pricing
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ticketPrices.map((price) => (
              <div key={price._id} className="overflow-hidden rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">{price.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => fetchPriceHistory(price._id)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        title="View Price History"
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDynamicPricing(price)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        title="Apply Dynamic Pricing"
                      >
                        <ArrowTrendingUpIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(price)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                        title="Edit Price"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(price._id)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                        title="Delete Price"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Row Pattern: {price.rowPattern}</p>
                    <p className="text-sm text-gray-500">Description: {price.description || 'N/A'}</p>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl font-bold text-indigo-600">₹{price.price.toFixed(2)}</span>
                      {price.currentAdjustment && (
                        <span className="ml-2 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Adjusted
                        </span>
                      )}
                      {!price.isActive && (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    {price.currentAdjustment && (
                      <div className="mt-1 text-sm text-gray-500">
                        <p>
                          {price.currentAdjustment.adjustmentType === 'percentage'
                            ? `${price.currentAdjustment.adjustmentValue}% adjustment`
                            : price.currentAdjustment.adjustmentType === 'direct'
                            ? `Direct price set to ₹${price.price.toFixed(2)}`
                            : `₹${price.currentAdjustment.adjustmentValue} adjustment`}
                        </p>
                        <p>Reason: {price.currentAdjustment.reason}</p>
                        {price.currentAdjustment.expiresAt && (
                          <p>
                            Expires: {new Date(price.currentAdjustment.expiresAt).toLocaleDateString()} 
                            {new Date(price.currentAdjustment.expiresAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regular Price Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">
                {editingPrice ? 'Edit Price Category' : 'Add New Price Category'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2"
                    required
                    placeholder="e.g., Premium, Standard, Economy"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Row Pattern</label>
                  <input
                    type="text"
                    name="rowPattern"
                    value={formData.rowPattern}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2"
                    required
                    placeholder="e.g., A|B|C for rows A, B, and C"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Use regular expression pattern to match seat rows (e.g., "A|B|C" for rows A, B, and C)
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Base Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2"
                    required
                    step="0.01"
                    min="0"
                    placeholder="e.g., 300"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This is the base price that will be used for all dynamic pricing calculations
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., Premium seats with extra legroom"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Active</span>
                  </label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                  >
                    {editingPrice ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dynamic Pricing Modal */}
        {showDynamicPricingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Apply Dynamic Pricing</h2>
              
              <form onSubmit={handleDynamicPricingSubmit}>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Apply To</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="applyToAll"
                      checked={dynamicPricingData.applyToAll}
                      onChange={handleDynamicPricingInputChange}
                      className="mr-2"
                    />
                    <span>Apply to all price categories</span>
                  </div>
                  
                  {!dynamicPricingData.applyToAll && (
                    <div className="mt-2">
                      <label className="mb-2 block text-sm font-bold">Price Category</label>
                      <select
                        name="priceId"
                        value={dynamicPricingData.priceId}
                        onChange={handleDynamicPricingInputChange}
                        className="w-full rounded border px-3 py-2"
                        required={!dynamicPricingData.applyToAll}
                      >
                        <option value="">Select a price category</option>
                        {ticketPrices.map((price) => (
                          <option key={price._id} value={price._id}>
                            {price.name} - Base Price: ₹{price.basePrice?.toFixed(2) || price.price?.toFixed(2)}
                            {price.currentAdjustment && ` (Current: ₹${price.price.toFixed(2)})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Adjustment Type</label>
                  <select
                    name="adjustmentType"
                    value={dynamicPricingData.adjustmentType}
                    onChange={handleDynamicPricingInputChange}
                    className="w-full rounded border px-3 py-2"
                    required
                  >
                    <option value="direct">Direct Price (₹)</option>
                    <option value="percentage">Percentage Adjustment (%)</option>
                    <option value="fixed">Fixed Amount Adjustment (₹)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {dynamicPricingData.adjustmentType === 'direct' 
                      ? 'Set the exact price directly' 
                      : dynamicPricingData.adjustmentType === 'percentage' 
                      ? 'Adjustments are applied to the base price, not the current price.'
                      : 'Adjustments are applied to the base price, not the current price.'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">
                    {dynamicPricingData.adjustmentType === 'direct' 
                      ? 'New Price (₹)' 
                      : dynamicPricingData.adjustmentType === 'percentage' 
                      ? 'Percentage (%)' 
                      : 'Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    name="adjustmentValue"
                    value={dynamicPricingData.adjustmentValue}
                    onChange={handleDynamicPricingInputChange}
                    className="w-full rounded border px-3 py-2"
                    required
                    step={dynamicPricingData.adjustmentType === 'percentage' ? '0.1' : '0.01'}
                    min={dynamicPricingData.adjustmentType === 'direct' ? '0' : null}
                    placeholder={
                      dynamicPricingData.adjustmentType === 'direct'
                        ? 'e.g., 400 for ₹400 price'
                        : dynamicPricingData.adjustmentType === 'percentage'
                        ? 'e.g., 10 for 10% increase'
                        : 'e.g., 50 for ₹50 increase'
                    }
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {dynamicPricingData.adjustmentType === 'direct' 
                      ? 'Enter the exact new price' 
                      : dynamicPricingData.adjustmentType === 'percentage' 
                      ? 'Use negative values for price reduction'
                      : 'Use negative values for price reduction'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Reason</label>
                  <input
                    type="text"
                    name="reason"
                    value={dynamicPricingData.reason}
                    onChange={handleDynamicPricingInputChange}
                    className="w-full rounded border px-3 py-2"
                    required
                    placeholder="e.g., Weekend surge, Special promotion"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-bold">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={dynamicPricingData.expiresAt}
                    onChange={handleDynamicPricingInputChange}
                    className="w-full rounded border px-3 py-2"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Leave empty for permanent adjustment
                  </p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDynamicPricingModal(false)}
                    className="rounded bg-gray-300 px-4 py-2 font-bold text-gray-700 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Price History Modal */}
        {showPriceHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Price Adjustment History</h2>
                <button
                  onClick={() => setShowPriceHistory(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {priceHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No price adjustment history found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Adjustment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Previous Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">New Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reason</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Expires</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {priceHistory.map((adjustment, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {new Date(adjustment.createdAt).toLocaleString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {adjustment.adjustmentType === 'percentage' 
                              ? 'Percentage' 
                              : adjustment.adjustmentType === 'direct'
                              ? 'Direct Price'
                              : 'Fixed Amount'}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {adjustment.adjustmentType === 'percentage' 
                              ? `${adjustment.adjustmentValue}%` 
                              : adjustment.adjustmentType === 'direct'
                              ? `₹${adjustment.adjustmentValue.toFixed(2)}`
                              : `₹${adjustment.adjustmentValue.toFixed(2)}`}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            ₹{adjustment.previousPrice.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            ₹{adjustment.newPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {adjustment.reason}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {adjustment.expiresAt 
                              ? new Date(adjustment.expiresAt).toLocaleString() 
                              : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketPriceAdmin 