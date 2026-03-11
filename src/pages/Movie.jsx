import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import MovieLists from '../components/MovieLists'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

const Movie = () => {
	const { auth } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const [movies, setMovies] = useState([])
	const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false)
	const [isAddingMovie, SetIsAddingMovie] = useState(false)
	const [showPriceModal, setShowPriceModal] = useState(false)
	const [selectedMovie, setSelectedMovie] = useState(null)
	const [priceAdjustment, setPriceAdjustment] = useState({
		adjustmentType: 'direct',
		adjustmentValue: '',
		reason: '',
		expiresAt: ''
	})
	const [isUpdatingBasePrices, setIsUpdatingBasePrices] = useState(false)

	const fetchMovies = async (data) => {
		try {
			setIsFetchingMoviesDone(false)
			const response = await axios.get('/movie')
			// console.log(response.data.data)
			reset()
			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingMoviesDone(true)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	const onAddMovie = async (data) => {
		try {
			data.length = (parseInt(data.lengthHr) || 0) * 60 + (parseInt(data.lengthMin) || 0)
			
			// Ensure price is a number
			data.price = parseFloat(data.price) || 0
			
			// Ensure trailer is not empty
			data.trailer = data.trailer || ''
			
			SetIsAddingMovie(true)
			const response = await axios.post('/movie', data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchMovies()
			toast.success('Add movie successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error(error.response?.data?.message || 'Error adding movie', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsAddingMovie(false)
		}
	}

	const handleDelete = (movie) => {
		const confirmed = window.confirm(
			`Do you want to delete movie ${movie.name}, including its showtimes and tickets?`
		)
		if (confirmed) {
			onDeleteMovie(movie._id)
		}
	}

	const onDeleteMovie = async (id) => {
		try {
			const response = await axios.delete(`/movie/${id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			// console.log(response.data)
			fetchMovies()
			toast.success('Delete movie successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		}
	}

	const handleAdjustPrice = (movie) => {
		setSelectedMovie(movie)
		setPriceAdjustment({
			adjustmentType: 'direct',
			adjustmentValue: movie.price,
			reason: '',
			expiresAt: ''
		})
		setShowPriceModal(true)
	}

	const handlePriceInputChange = (e) => {
		const { name, value } = e.target
		setPriceAdjustment({
			...priceAdjustment,
			[name]: value
		})
	}

	const handlePriceSubmit = async (e) => {
		e.preventDefault()
		
		try {
			const payload = {
				movieId: selectedMovie._id,
				...priceAdjustment,
				adjustmentValue: Number(priceAdjustment.adjustmentValue)
			}
			
			const response = await axios.post('/movie/adjust-price', payload, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			
			toast.success('Price adjustment applied successfully', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			
			setShowPriceModal(false)
			fetchMovies()
		} catch (error) {
			console.error('Error applying price adjustment:', error)
			toast.error(error.response?.data?.message || 'Error applying price adjustment', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		}
	}

	const handleUpdateAllBasePrices = async () => {
		try {
			setIsUpdatingBasePrices(true)
			const response = await axios.get('/movie/update-base-prices', {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			
			toast.success(response.data.message, {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			
			fetchMovies()
		} catch (error) {
			console.error('Error updating base prices:', error)
			toast.error(error.response?.data?.message || 'Error updating base prices', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			setIsUpdatingBasePrices(false)
		}
	}

	const inputHr = parseInt(watch('lengthHr')) || 0
	const inputMin = parseInt(watch('lengthMin')) || 0
	const sumMin = inputHr * 60 + inputMin
	const hr = Math.floor(sumMin / 60)
	const min = sumMin % 60

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
			<Navbar />
			<div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between">
					<h2 className="text-3xl font-bold text-gray-900">Movie Lists</h2>
					<div className="flex flex-wrap gap-2 mt-2 md:mt-0">
						<button
							onClick={handleUpdateAllBasePrices}
							className="flex items-center rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-purple-400"
							disabled={isUpdatingBasePrices}
						>
							{isUpdatingBasePrices ? 'Updating...' : 'Update All Base Prices'}
						</button>
					</div>
				</div>
				<form
					onSubmit={handleSubmit(onAddMovie)}
					className="flex flex-col items-stretch justify-end gap-x-4 gap-y-2 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 drop-shadow-md lg:flex-row"
				>
					<div className="flex w-full grow flex-col flex-wrap justify-start gap-4 lg:w-auto">
						<h3 className="text-xl font-bold">Add Movie</h3>
						<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5">Name :</label>
							<input
								type="text"
								required
								className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
								{...register('name', {
									required: true
								})}
							/>
						</div>
						<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5">Poster URL :</label>
							<input
								type="text"
								required
								className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
								{...register('img', {
									required: true
								})}
							/>
						</div>
						<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5">Trailer URL :</label>
							<input
								type="text"
								required
								className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
								{...register('trailer', {
									required: true
								})}
							/>
						</div>
						<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5">Length (hr.):</label>
							<input
								type="number"
								min="0"
								max="20"
								maxLength="2"
								className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
								{...register('lengthHr')}
							/>
						</div>
						<div>
							<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
								<label className="text-lg font-semibold leading-5">Length (min.):</label>
								<input
									type="number"
									min="0"
									max="2000"
									maxLength="4"
									required
									className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
									{...register('lengthMin', {
										required: true
									})}
								/>
							</div>
							<div className="pt-1 text-right">{`${hr}h ${min}m / ${sumMin}m `}</div>
						</div>
						<div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
							<label className="text-lg font-semibold leading-5">Price (₹):</label>
							<input
								type="number"
								min="0"
								step="0.01"
								required
								className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
								{...register('price', {
									required: true,
									min: 0
								})}
							/>
						</div>
					</div>
					<div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row">
						{watch('img') && (
							<img src={watch('img')} className="h-48 rounded-md object-contain drop-shadow-md lg:h-64" />
						)}
						<button
							className="w-full min-w-fit items-center rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-center font-medium text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-500 disabled:to-slate-400 lg:w-24 xl:w-32 xl:text-xl"
							type="submit"
							disabled={isAddingMovie}
						>
							{isAddingMovie ? 'Processing...' : 'ADD +'}
						</button>
					</div>
				</form>
				<div className="relative drop-shadow-sm">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-500" />
					</div>
					<input
						type="search"
						className="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-gray-900"
						placeholder="Search movie"
						{...register('search')}
					/>
				</div>
				{isFetchingMoviesDone ? (
					<MovieLists 
						movies={movies} 
						search={watch('search')} 
						handleDelete={handleDelete} 
						handleAdjustPrice={handleAdjustPrice}
					/>
				) : (
					<Loading />
				)}
			</div>
			
			{/* Price Adjustment Modal */}
			{showPriceModal && selectedMovie && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
						<h2 className="mb-4 text-xl font-bold">
							Adjust Price for {selectedMovie.name}
						</h2>
						<div className="mb-4">
							<p className="font-medium">Base Price: ₹{selectedMovie.basePrice?.toFixed(2) || selectedMovie.price?.toFixed(2) || '0.00'}</p>
							{selectedMovie.currentAdjustment && (
								<p className="text-blue-600">Current Price: ₹{selectedMovie.price?.toFixed(2) || '0.00'}</p>
							)}
							{selectedMovie.currentAdjustment && (
								<p className="text-sm text-gray-500 mt-1">
									Current adjustment: {selectedMovie.currentAdjustment.adjustmentType === 'percentage' 
										? `${selectedMovie.currentAdjustment.adjustmentValue}% adjustment` 
										: selectedMovie.currentAdjustment.adjustmentType === 'direct'
										? `Direct price set to ₹${selectedMovie.price?.toFixed(2)}`
										: `₹${selectedMovie.currentAdjustment.adjustmentValue} adjustment`}
									{selectedMovie.currentAdjustment.expiresAt && 
										` (expires: ${new Date(selectedMovie.currentAdjustment.expiresAt).toLocaleDateString()})`}
								</p>
							)}
						</div>
						
						<form onSubmit={handlePriceSubmit}>
							<div className="mb-4">
								<label className="mb-2 block text-sm font-bold">Adjustment Type</label>
								<select
									name="adjustmentType"
									value={priceAdjustment.adjustmentType}
									onChange={handlePriceInputChange}
									className="w-full rounded border px-3 py-2"
									required
								>
									<option value="direct">Direct Price (₹)</option>
									<option value="fixed">Fixed Amount Adjustment (₹)</option>
									<option value="percentage">Percentage Adjustment (%)</option>
								</select>
								<p className="mt-1 text-xs text-gray-500">
									{priceAdjustment.adjustmentType === 'direct' 
										? 'Set the exact price directly' 
										: 'Adjustments are applied to the base price, not the current price.'}
								</p>
							</div>
							
							<div className="mb-4">
								<label className="mb-2 block text-sm font-bold">
									{priceAdjustment.adjustmentType === 'direct' 
										? 'New Price (₹)' 
										: priceAdjustment.adjustmentType === 'fixed' 
										? 'Amount (₹)' 
										: 'Percentage (%)'}
								</label>
								<input
									type="number"
									name="adjustmentValue"
									value={priceAdjustment.adjustmentValue}
									onChange={handlePriceInputChange}
									className="w-full rounded border px-3 py-2"
									required
									step={priceAdjustment.adjustmentType === 'percentage' ? '0.1' : '0.01'}
									min={priceAdjustment.adjustmentType === 'direct' ? '0' : null}
									placeholder={
										priceAdjustment.adjustmentType === 'direct' 
										? 'e.g., 400 for ₹400 price' 
										: priceAdjustment.adjustmentType === 'fixed' 
										? 'e.g., 50 for ₹50 increase' 
										: 'e.g., 10 for 10% increase'
									}
								/>
								<p className="mt-1 text-sm text-gray-500">
									{priceAdjustment.adjustmentType === 'direct' 
										? 'Enter the exact new price' 
										: 'Use negative values for price reduction'}
								</p>
							</div>
							
							<div className="mb-4">
								<label className="mb-2 block text-sm font-bold">Reason</label>
								<input
									type="text"
									name="reason"
									value={priceAdjustment.reason}
									onChange={handlePriceInputChange}
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
									value={priceAdjustment.expiresAt}
									onChange={handlePriceInputChange}
									className="w-full rounded border px-3 py-2"
								/>
								<p className="mt-1 text-sm text-gray-500">
									Leave empty for permanent adjustment
								</p>
							</div>
							
							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() => setShowPriceModal(false)}
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
		</div>
	)
}

export default Movie