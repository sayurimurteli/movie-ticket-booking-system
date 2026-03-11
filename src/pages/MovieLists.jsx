//new page

import React from 'react';

const MovieLists = ({ movies, search, handleDelete }) => {
	const filteredMovies = movies.filter(movie => movie.name.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{filteredMovies.map(movie => (
				<div key={movie._id} className="bg-white rounded-lg shadow-md p-4">
					<img src={movie.img} alt={movie.name} className="w-full h-64 object-cover rounded-md" />
					<h3 className="text-lg font-bold mt-2">{movie.name}</h3>

					{/* Movie Length Display */}
					<p className="text-gray-700">Length: {Math.floor(movie.length / 60)} hr {movie.length % 60} min</p>

					{/* Movie Trailer Embed */}
					{movie.trailer && movie.trailer.includes('youtube') ? (
						<div className="mt-4">
							<h4 className="text-md font-semibold">Trailer:</h4>
							<iframe
								width="100%"
								height="200"
								src={movie.trailer.replace('watch?v=', 'embed/')}
								title={movie.name}
								allowFullScreen
								className="rounded-md"
							></iframe>
						</div>
					) : (
						<p className="text-sm text-gray-500">No trailer available</p>
					)}

					<button onClick={() => handleDelete(movie)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500">
						Delete
					</button>
				</div>
			))}
		</div>
	);
};

export default MovieLists;
