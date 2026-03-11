import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import ShowtimeDetails from '../components/ShowtimeDetails'
import { AuthContext } from '../context/AuthContext'
import { TrashIcon, CreditCardIcon, CalendarIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

const Tickets = () => {
	const { auth } = useContext(AuthContext)
	const [tickets, setTickets] = useState([])
	const [isFetchingTicketsDone, setIsFetchingTicketsDone] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [cancellingTicketId, setCancellingTicketId] = useState(null)

	const fetchTickets = async () => {
		try {
			setIsFetchingTicketsDone(false);
			console.log("Fetching tickets...");
			
			// Get user tickets
			const response = await axios.get('/auth/tickets', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			});
			console.log("Tickets response:", response.data);
			
			// Get user data to access payment information
			const userResponse = await axios.get('/auth/me', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			});
			console.log("User response:", userResponse.data);
			
			// Check if tickets exist
			if (!response.data.data.tickets) {
				console.log("No tickets found in response");
				setTickets([]);
				return;
			}
			
			// Map payment information to tickets
			const ticketsWithPayments = response.data.data.tickets.map(ticket => {
				// Find matching payment by paymentId if it exists
				const payment = userResponse.data.data.payments?.find(
					p => p.paymentId === ticket.paymentId
				);
				
				return {
					...ticket,
					payment
				};
			});
			
			console.log("Processed tickets:", ticketsWithPayments);
			
			// Sort by showtime date
			setTickets(
				ticketsWithPayments?.sort((a, b) => (a.showtime.showtime > b.showtime.showtime ? 1 : -1))
			);
		} catch (error) {
			console.error("Error fetching tickets:", error);
			console.error("Error details:", error.response?.data || error.message);
			toast.error(error.response?.data?.message || 'Error fetching tickets', {
				position: 'top-center',
				autoClose: 3000,
				pauseOnHover: true
			});
			// Set empty tickets array to prevent rendering issues
			setTickets([]);
		} finally {
			setIsFetchingTicketsDone(true);
		}
	};

	const cancelTicket = async (ticketId) => {
		if (!window.confirm('Are you sure you want to cancel this ticket?')) {
			return;
		}
		
		setIsLoading(true);
		setCancellingTicketId(ticketId);
		try {
			await axios.delete(`/showtime/ticket/${ticketId}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			});
			
			toast.success('Ticket cancelled successfully', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			});
			
			// Refresh tickets
			fetchTickets();
		} catch (error) {
			console.error(error);
			toast.error(error.response?.data?.message || 'Error cancelling ticket', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			});
		} finally {
			setIsLoading(false);
			setCancellingTicketId(null);
		}
	};

	useEffect(() => {
		console.log("Tickets component mounted");
		fetchTickets();
		
		// Add cleanup function
		return () => {
			console.log("Tickets component unmounted");
		};
	}, []);
	
	// Add error boundary
	useEffect(() => {
		const handleError = (error) => {
			console.error("Error in Tickets component:", error);
			toast.error("An error occurred while displaying tickets. Please try again.", {
				position: "top-center",
				autoClose: 3000
			});
		};
		
		window.addEventListener("error", handleError);
		return () => window.removeEventListener("error", handleError);
	}, []);
	
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString();
	};
	
	// Check if a showtime is in the future and can be cancelled
	const canCancelTicket = (showtime) => {
		const showtimeDate = new Date(showtime.showtime);
		const now = new Date();
		return showtimeDate > now;
	};

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<h2 className="text-3xl font-bold text-gray-900">My Tickets & Transactions</h2>
				{isFetchingTicketsDone ? (
					<>
						{tickets.length === 0 ? (
							<div className="text-center p-8 bg-white rounded-lg shadow-md">
								<p className="mb-4">You have not purchased any tickets yet</p>
								<a 
									href="/cinema" 
									className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
								>
									Browse Movies
								</a>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-6">
								{tickets.map((ticket, index) => {
									// Add null check for ticket and ticket.showtime
									if (!ticket || !ticket.showtime) {
										console.error("Invalid ticket data:", ticket);
										return (
											<div key={index} className="bg-red-50 p-4 rounded-lg shadow-md border border-red-200">
												<p className="text-red-600">Error displaying this ticket. Please contact support.</p>
											</div>
										);
									}
									
									const isCancellable = canCancelTicket(ticket.showtime);
									return (
										<div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden" key={index}>
											<ShowtimeDetails showtime={ticket.showtime} />
											
											<div className="p-4 border-t border-gray-200">
												<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
													<div className="flex items-center mb-2 md:mb-0">
														<CalendarIcon className="h-5 w-5 text-indigo-600 mr-2" />
														<span className="font-semibold">
															{new Date(ticket.showtime.showtime).toLocaleDateString()}
														</span>
													</div>
													<div className="flex items-center">
														<ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
														<span className="font-semibold">
															{new Date(ticket.showtime.showtime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
														</span>
													</div>
												</div>
												
												<div className="mb-4">
													<h3 className="text-lg font-bold mb-2">Seats:</h3>
													<div className="flex flex-wrap gap-3">
														{ticket.seats && ticket.seats.length > 0 ? (
															ticket.seats.map((seat, i) => (
																<div key={i} className="flex flex-col items-center bg-indigo-50 p-2 rounded-md">
																	<div className="bg-indigo-600 text-white font-bold rounded-md px-3 py-1 mb-1">
																		{seat.row}{seat.number}
																	</div>
																	<span className="text-xs text-gray-600">
																		{typeof seat.price === 'number' 
																			? `₹${seat.price.toFixed(2)}` 
																			: (ticket.payment?.amount 
																				? `₹${(ticket.payment.amount / ticket.seats.length).toFixed(2)}` 
																				: '')}
																	</span>
																	{seat.category && seat.category !== 'Standard' && (
																		<span className="text-xs text-indigo-600 mt-1">{seat.category}</span>
																	)}
																</div>
															))
														) : (
															<p className="text-gray-500 italic">No seat information available</p>
														)}
													</div>
												</div>
												
												{ticket.payment && (
													<div className="bg-gray-50 p-3 rounded-md mb-4">
														<div className="flex items-center mb-2">
															<CreditCardIcon className="h-5 w-5 text-green-600 mr-2" />
															<h3 className="font-bold">Payment Details</h3>
														</div>
														<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
															<div>
																<span className="text-gray-600">Transaction ID:</span>
																<span className="ml-2 font-mono">{ticket.paymentId ? (ticket.paymentId.substring(0, 12) + '...') : 'N/A'}</span>
															</div>
															<div>
																<span className="text-gray-600">Date:</span>
																<span className="ml-2">{formatDate(ticket.paymentDate || ticket.payment.createdAt || new Date())}</span>
															</div>
															<div>
																<span className="text-gray-600">Amount:</span>
																<span className="ml-2 font-semibold">
																	{ticket.payment.amount 
																		? `₹${ticket.payment.amount.toFixed(2)}` 
																		: 'N/A'}
																</span>
															</div>
															<div>
																<span className="text-gray-600">Status:</span>
																<span className="ml-2">
																	<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
																		{ticket.payment.status || 'Completed'}
																	</span>
																</span>
															</div>
														</div>
													</div>
												)}
												
												<div className="flex justify-end">
													{isCancellable ? (
														<button
															onClick={() => cancelTicket(ticket._id)}
															disabled={isLoading && cancellingTicketId === ticket._id}
															className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
														>
															<TrashIcon className="h-5 w-5 mr-1" />
															{isLoading && cancellingTicketId === ticket._id ? 'Processing...' : 'Cancel Ticket'}
														</button>
													) : (
														<div className="flex items-center text-gray-600">
															<ExclamationCircleIcon className="h-5 w-5 mr-1 text-amber-500" />
															<span>Cannot cancel past showtimes</span>
														</div>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</>
				) : (
					<Loading />
				)}
			</div>
		</div>
	);
}

export default Tickets




