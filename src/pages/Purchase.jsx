import { TicketIcon, CreditCardIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'
import StripeProvider from '../components/StripeProvider'
import PaymentForm from '../components/PaymentForm'

const Purchase = () => {
	const navigate = useNavigate()
	const { auth } = useContext(AuthContext)
	const location = useLocation()
	const showtime = location.state.showtime
	const selectedSeats = location.state.selectedSeats || []
	const [isPurchasing, setIsPurchasing] = useState(false)
	const [seatPrices, setSeatPrices] = useState({})
	const [totalPrice, setTotalPrice] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [paymentStep, setPaymentStep] = useState('summary') // summary, payment
	const [clientSecret, setClientSecret] = useState('')
	const [paymentIntentId, setPaymentIntentId] = useState('')

	useEffect(() => {
		const fetchSeatPrices = async () => {
			setIsLoading(true)
			try {
				// Reset values when fetching new prices
				setSeatPrices({})
				setTotalPrice(0)
				
				if (selectedSeats.length === 0) {
					setIsLoading(false)
					return
				}
				
				// Get the movie's base price
				const basePrice = showtime.movie.price || 400; // Default to 400 if not available
				console.log(`Using movie base price: ${basePrice} Rs per seat`);
				
				// Create an array of promises for each seat price request
				const pricePromises = selectedSeats.map(async (seat) => {
					const row = seat.match(/([A-Za-z]+)/)[0]
					const number = seat.match(/(\d+)/)[0]
					
					try {
						// Still fetch the seat category from the API
						const response = await axios.get(`/ticket-price/seat/${row}/${number}`)
						const seatCategory = response.data.data.name || 'Standard';
						
						// Use the movie's base price instead of the API price
						return { 
							seat, 
							price: basePrice, // Use movie base price
							name: seatCategory 
						}
					} catch (error) {
						console.error(`Error fetching category for seat ${seat}:`, error);
						// Fallback to base price and standard category
						return {
							seat,
							price: basePrice,
							name: 'Standard'
						};
					}
				})

				// Wait for all price requests to complete
				const prices = await Promise.all(pricePromises)
				
				// Create a new price map and calculate total
				const priceMap = {}
				let calculatedTotal = 0
				
				// Process each seat price
				for (const { seat, price, name } of prices) {
					// Validate the price
					if (isNaN(price) || price <= 0) {
						console.error(`Invalid price for seat ${seat}: ${price}`)
						toast.error(`Invalid price for seat ${seat}. Please try again.`)
						setIsLoading(false)
						return
					}
					
					// Add to price map and total
					priceMap[seat] = { price, name }
					calculatedTotal += price
					
					// Log for debugging
					console.log(`Seat ${seat}: ${price} Rs (${name})`)
				}
				
				// Log the final calculation
				console.log(`Total for ${selectedSeats.length} seats: ${calculatedTotal} Rs`)
				
				// Update state with validated data
				setSeatPrices(priceMap)
				setTotalPrice(calculatedTotal)
			} catch (error) {
				console.error('Error fetching seat prices:', error)
				toast.error('Error fetching seat prices', {
					position: 'top-center',
					autoClose: 2000,
					pauseOnHover: false
				})
			} finally {
				setIsLoading(false)
			}
		}

		// Only fetch prices if there are selected seats
		fetchSeatPrices()
	}, [selectedSeats, showtime.movie.price])

	const createPaymentIntent = async () => {
		setIsPurchasing(true)
		try {
			// Validate total price before sending
			if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
				throw new Error(`Invalid total price: ${totalPrice}. Please select seats again.`)
			}
			
			// Verify that the total price matches the expected price based on the movie's base price
			const basePrice = showtime.movie.price || 400; // Default to 400 if not available
			const expectedTotal = basePrice * selectedSeats.length;
			
			// If there's a significant difference, log a warning and use the expected total
			if (Math.abs(totalPrice - expectedTotal) > 1) {
				console.warn(`Price mismatch: calculated total ${totalPrice} doesn't match expected total ${expectedTotal}`);
				console.warn(`Using expected total based on movie base price: ${expectedTotal}`);
				setTotalPrice(expectedTotal);
				
				// Update seat prices to match base price
				const updatedPrices = {...seatPrices};
				selectedSeats.forEach(seat => {
					if (updatedPrices[seat]) {
						updatedPrices[seat].price = basePrice;
					}
				});
				setSeatPrices(updatedPrices);
				
				// Show a notification to the user
				toast.info(`Adjusting prices to match movie base price (₹${basePrice.toFixed(2)} per seat)`, {
					position: 'top-center',
					autoClose: 3000
				});
				
				// Wait a moment for the state to update
				await new Promise(resolve => setTimeout(resolve, 500));
			}
			
			// Log payment details for debugging
			console.log(`Creating payment intent for ${selectedSeats.length} seats:`)
			console.log(`- Total amount: ${totalPrice} Rs`)
			console.log(`- Selected seats: ${selectedSeats.join(', ')}`)
			console.log(`- Showtime ID: ${showtime._id}`)
			
			// Send request to create payment intent
			const response = await axios.post(
				'/payments/create-intent',
				{
					amount: totalPrice,
					showtimeId: showtime._id,
					seats: selectedSeats
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			
			// Verify response contains client secret
			if (!response.data.clientSecret) {
				throw new Error('Payment intent creation failed: No client secret returned')
			}
			
			console.log('Payment intent created successfully')
			setClientSecret(response.data.clientSecret)
			setPaymentIntentId(response.data.paymentIntentId)
			setPaymentStep('payment')
		} catch (error) {
			console.error('Error creating payment intent:', error)
			toast.error(error.response?.data?.error || error.message || 'Error creating payment', {
				position: 'top-center',
				autoClose: 3000,
				pauseOnHover: true
			})
		} finally {
			setIsPurchasing(false)
		}
	}

	const handlePaymentSuccess = async (paymentIntent) => {
		try {
			// Validate that we have all required data
			if (!paymentIntentId || !showtime._id || selectedSeats.length === 0) {
				throw new Error('Missing required payment information')
			}
			
			// Get the movie's base price
			const basePrice = showtime.movie.price || 400; // Default to 400 if not available
			
			// Format the seat prices to include only the necessary information
			const formattedSeatPrices = {};
			
			// Validate each seat has a valid price
			let totalCalculated = 0;
			
			for (const seat of selectedSeats) {
				// Ensure we have price information for this seat
				if (!seatPrices[seat]) {
					console.error(`Missing price information for seat ${seat}`);
					throw new Error(`Missing price information for seat ${seat}`);
				}
				
				// Use the movie's base price to ensure consistency
				const price = basePrice;
				const category = seatPrices[seat].name || 'Standard';
				
				// Add to formatted seat prices
				formattedSeatPrices[seat] = {
					price: price,
					name: category
				}
				
				// Add to calculated total for verification
				totalCalculated += price;
			}
			
			// Verify total matches expected amount
			console.log(`Confirming payment for ${selectedSeats.length} seats:`)
			console.log(`- Calculated total: ${totalCalculated} Rs`)
			console.log(`- Stored total: ${totalPrice} Rs`)
			console.log(`- Seat prices: ${JSON.stringify(formattedSeatPrices)}`)
			
			// Send confirmation to server
			const response = await axios.post(
				'/payments/confirm',
				{
					paymentIntentId,
					showtimeId: showtime._id,
					seats: selectedSeats,
					seatPrices: formattedSeatPrices,
					totalAmount: totalCalculated // Send calculated total for verification
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`
					}
				}
			)
			
			// Handle successful payment
			toast.success('Payment successful! Your tickets have been booked.', {
				position: 'top-center',
				autoClose: 3000
			})
			
			// Reset state and navigate
			setPaymentStep('success')
			setTimeout(() => {
				navigate('/ticket')
			}, 3000)
		} catch (error) {
			console.error('Payment confirmation error:', error)
			toast.error(error.response?.data?.error || error.message || 'Error confirming payment', {
				position: 'top-center',
				autoClose: 3000,
				pauseOnHover: true
			})
			setPaymentStep('error')
		}
	}

	const handlePaymentCancel = () => {
		setPaymentStep('summary')
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
			<Navbar />
			<div className="mx-4 h-fit rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<ShowtimeDetails showtime={showtime} />
				
				{paymentStep === 'summary' ? (
					<>
						<div className="flex flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
							<div className="flex flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
								<p className="font-semibold">Selected Seats : </p>
								<p className="text-start">{selectedSeats.join(', ')}</p>
								{!!selectedSeats.length && <p className="whitespace-nowrap">({selectedSeats.length} seats)</p>}
							</div>
							{!!selectedSeats.length && (
								<button
									onClick={createPaymentIntent}
									className="flex items-center justify-center gap-2 rounded-b-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-4 py-1 font-semibold text-white hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-500 disabled:to-slate-400 md:rounded-none md:rounded-br-lg"
									disabled={isPurchasing || isLoading}
								>
									{isPurchasing ? (
										'Processing...'
									) : isLoading ? (
										'Loading prices...'
									) : (
										<>
											<p>Proceed to Payment (₹{totalPrice.toFixed(2)})</p>
											<CreditCardIcon className="h-7 w-7 text-white" />
										</>
									)}
								</button>
							)}
						</div>

						{selectedSeats.length > 0 && !isLoading && (
							<div className="mt-6 bg-white p-4 rounded-lg shadow">
								<h3 className="text-lg font-semibold mb-2">Selected Seats</h3>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
									{selectedSeats.map((seat) => (
										<div key={seat} className="bg-indigo-50 p-2 rounded flex flex-col items-center">
											<span className="font-semibold">{seat}</span>
											{seatPrices[seat] && (
												<>
													<span className="text-sm text-gray-600">₹{seatPrices[seat].price.toFixed(2)}</span>
													{seatPrices[seat].name !== 'Standard' && (
														<span className="text-xs text-indigo-600">{seatPrices[seat].name}</span>
													)}
												</>
											)}
										</div>
									))}
								</div>
								
								{/* Total price display */}
								<div className="border-t pt-3 mt-2">
									<div className="flex justify-between items-center">
										<span className="font-medium">Total Price:</span>
										<span className="text-xl font-bold text-indigo-700">₹{totalPrice.toFixed(2)}</span>
									</div>
									<div className="text-xs text-gray-500 mt-1">
										{selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × average ₹{(totalPrice / selectedSeats.length).toFixed(2)} per seat
									</div>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="mt-4 rounded-lg bg-white p-4 shadow-md">
						<h3 className="mb-4 text-xl font-bold text-center">Complete Your Payment</h3>
						<p className="mb-6 text-center text-gray-600">
							You are paying ₹{totalPrice.toFixed(2)} for {selectedSeats.length} seat(s): {selectedSeats.join(', ')}
						</p>
						
						{clientSecret && (
							<StripeProvider clientSecret={clientSecret}>
								<PaymentForm 
									amount={totalPrice} 
									onSuccess={handlePaymentSuccess}
									onCancel={handlePaymentCancel}
								/>
							</StripeProvider>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default Purchase
