import { TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid'

const MovieLists = ({ movies, search, handleDelete, handleAdjustPrice }) => {
	const moviesList = movies?.filter((movie) => movie.name.toLowerCase().includes(search?.toLowerCase() || ''))

	return !!moviesList.length ? (
		<div className="grid grid-cols-1 gap-4 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 drop-shadow-md lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-5">
			{moviesList.map((movie, index) => {
				return (
					<div key={index} className="flex min-w-fit flex-grow rounded-md bg-white drop-shadow-md">
						<img src={movie.img} className="h-36 rounded-md object-contain drop-shadow-md sm:h-48" />
						<div className="flex flex-grow flex-col justify-between p-2">
							<div>
								<p className="text-lg font-semibold sm:text-xl">{movie.name}</p>
								<p>Length: {movie.length || '-'} min.</p>
								<div>
									{movie.currentAdjustment ? (
										<div>
											<p className="text-blue-600 font-medium">
												Current Price: ₹{movie.price?.toFixed(2) || '0.00'}
											</p>
											<p className="text-gray-500 text-sm">
												Base Price: ₹{movie.basePrice?.toFixed(2) || movie.price?.toFixed(2) || '0.00'}
											</p>
											<p className="text-xs text-gray-400 italic">
												{movie.currentAdjustment.adjustmentType === 'percentage' 
													? `${movie.currentAdjustment.adjustmentValue}% adjustment` 
													: movie.currentAdjustment.adjustmentType === 'direct'
													? `Direct price set to ₹${movie.price?.toFixed(2)}`
													: `₹${movie.currentAdjustment.adjustmentValue} adjustment`}
												{movie.currentAdjustment.expiresAt && 
													` (expires: ${new Date(movie.currentAdjustment.expiresAt).toLocaleDateString()})`}
											</p>
										</div>
									) : (
										<p className="text-blue-600 font-medium">
											Price: ₹{movie.price?.toFixed(2) || '0.00'}
										</p>
									)}
								</div>
							</div>
							<div className="flex justify-between mt-2">
								<button
									className="flex items-center gap-1 rounded-md bg-gradient-to-br from-indigo-700 to-blue-600 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-indigo-600 hover:to-blue-500"
									onClick={() => handleAdjustPrice(movie)}
								>
									ADJUST PRICE
									<CurrencyDollarIcon className="h-5 w-5" />
								</button>
								<button
									className="flex items-center gap-1 rounded-md bg-gradient-to-br from-red-700 to-rose-600 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-red-600 hover:to-rose-500"
									onClick={() => handleDelete(movie)}
								>
									DELETE
									<TrashIcon className="h-5 w-5" />
								</button>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	) : (
		<div>No movies found</div>
	)
}

export default MovieLists
