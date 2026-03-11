

// import { useState } from "react";
// import 'react-toastify/dist/ReactToastify.css';
// import Loading from './Loading';

// const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, isFetchingMoviesDone }) => {
//     const [trailer, setTrailer] = useState(null); // Store Trailer URL

//     return (
//         <div className="mx-4 flex flex-col rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-lg sm:mx-8 sm:p-8">
//             <h2 className="text-3xl font-bold tracking-wide sm:text-4xl text-center">🎬 Now Showing</h2>

//             {isFetchingMoviesDone ? (
//                 movies.length ? (
//                     <div className="mt-6 flex justify-center">
//                         <div className="flex w-full max-w-5xl overflow-x-auto gap-6 scrollbar-hide">
//                             {movies.map((movie, index) => {
//                                 const isSelected = movies[selectedMovieIndex]?._id === movie._id;
//                                 return (
//                                     <div
//                                         key={index}
//                                         title={movie.name}
//                                         className={`group relative flex flex-col w-32 sm:w-40 rounded-xl p-2 transition-all duration-300 cursor-pointer ${
//                                             isSelected
//                                                 ? "bg-blue-700 text-white shadow-2xl scale-105 ring-4 ring-blue-400"
//                                                 : "bg-gray-100 text-gray-900 hover:bg-blue-600 hover:text-white hover:scale-105 shadow-md"
//                                         }`}
//                                         onClick={() => {
//                                             setSelectedMovieIndex(isSelected ? null : index);
//                                             sessionStorage.setItem("selectedMovieIndex", isSelected ? null : index);
//                                         }}
//                                     >
//                                         <img
//                                             src={movie.img}
//                                             alt={movie.name}
//                                             className="h-44 sm:h-52 rounded-lg object-cover transition-all duration-300 group-hover:scale-105"
//                                         />
//                                         <p className="mt-2 text-center text-sm sm:text-base font-medium tracking-wide">
//                                             {movie.name}
//                                         </p>

//                                         {/* Floating Watch Now Button */}
//                                         <button
//                                             className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 text-white px-3 py-2 rounded-md text-sm sm:text-base"
//                                             onClick={(e) => {
//                                                 e.stopPropagation(); // Prevent parent click
//                                                 setTrailer(movie.trailer);
//                                             }}
//                                         >
//                                             ▶ Watch Now
//                                         </button>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 ) : (
//                     <p className="mt-6 text-center text-gray-300 text-lg">🚫 No movies available</p>
//                 )
//             ) : (
//                 <Loading />
//             )}

//             {/* Trailer Modal */}
//             {trailer && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
//                     <div className="relative w-full max-w-2xl bg-gray-900 p-4 rounded-lg shadow-lg">
//                         <button
//                             className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md"
//                             onClick={() => setTrailer(null)}
//                         >
//                             ✖ Close
//                         </button>
//                         <iframe
//                             className="w-full h-72 sm:h-96 rounded-lg"
//                             src={trailer}
//                             title="Movie Trailer"
//                             allowFullScreen
//                         ></iframe>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default NowShowing;

//*********************************************** */

// import 'react-toastify/dist/ReactToastify.css'
// import Loading from './Loading'

// const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
// 	return (
// 		<div className="mx-4 flex flex-col rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 text-gray-900 drop-shadow-md sm:mx-8 sm:p-6">
// 			<h2 className="text-3xl font-bold">Now Showing</h2>
// 			{isFetchingMoviesDone ? (
// 				movies.length ? (
// 					<div className="mt-1 overflow-x-auto sm:mt-3">
// 						<div className="mx-auto flex w-fit gap-4">
// 							{movies?.map((movie, index) => {
// 								return movies[selectedMovieIndex]?._id === movie._id ? (
// 									<div
// 										key={index}
// 										title={movie.name}
// 										className="flex w-[108px] flex-col rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 p-1 text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-400 sm:w-[144px]"
// 										onClick={() => {
// 											setSelectedMovieIndex(null)
// 											sessionStorage.setItem('selectedMovieIndex', null)
// 										}}
// 									>
// 										<img
// 											src={movie.img}
// 											className="h-36 rounded-md object-cover drop-shadow-md sm:h-48"
// 										/>
// 										<p className="truncate pt-1 text-center text-sm font-semibold leading-4">
// 											{movie.name}
// 										</p>
// 									</div>
// 								) : (
// 									<div
// 										key={index}
// 										className="flex w-[108px] flex-col rounded-md bg-white p-1 drop-shadow-md hover:bg-gradient-to-br hover:from-indigo-500 hover:to-blue-400 hover:text-white sm:w-[144px]"
// 										onClick={() => {
// 											setSelectedMovieIndex(index)
// 											sessionStorage.setItem('selectedMovieIndex', index)
// 										}}
// 									>
// 										<img
// 											src={movie.img}
// 											className="h-36 rounded-md object-cover drop-shadow-md sm:h-48"
// 										/>
// 										<p className="truncate pt-1 text-center text-sm font-semibold leading-4">
// 											{movie.name}
// 										</p>
// 									</div>
// 								)
// 							})}
// 						</div>
// 					</div>
// 				) : (
// 					<p className="mt-4 text-center">There are no movies available</p>
// 				)
// 			) : (
// 				<Loading />
// 			)}
// 		</div>
// 	)
// }

// export default NowShowing


// import { useState } from 'react';
// import 'react-toastify/dist/ReactToastify.css';
// import Loading from './Loading';

// const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
//     const [showTrailer, setShowTrailer] = useState(null);

//     return (
//         <div className="mx-4 flex flex-col rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 text-gray-900 drop-shadow-md sm:mx-8 sm:p-6">
//             <h2 className="text-3xl font-bold">Now Showing</h2>

//             {isFetchingMoviesDone ? (
//                 movies.length ? (
//                     <>
//                         <div className="mt-1 overflow-x-auto sm:mt-3">
//                             <div className="mx-auto flex w-fit gap-4">
//                                 {movies.map((movie, index) => {
//                                     const isSelected = movies[selectedMovieIndex]?._id === movie._id;
                                    
//                                     return (
//                                         <div
//                                             key={index}
//                                             title={movie.name}
//                                             className={`flex w-[108px] flex-col rounded-md p-1 drop-shadow-md sm:w-[144px] 
//                                                 ${isSelected ? 'bg-gradient-to-br from-indigo-600 to-blue-500 text-white' : 'bg-white hover:from-indigo-500 hover:to-blue-400 hover:text-white'}
//                                             `}
//                                             onClick={() => {
//                                                 if (isSelected) {
//                                                     setSelectedMovieIndex(null);
//                                                     setShowTrailer(null);
//                                                     sessionStorage.setItem('selectedMovieIndex', null);
//                                                 } else {
//                                                     setSelectedMovieIndex(index);
//                                                     setShowTrailer(movie.trailer || null);
//                                                     sessionStorage.setItem('selectedMovieIndex', index);
//                                                 }
//                                             }}
//                                         >
//                                             <img src={movie.img} className="h-36 rounded-md object-cover drop-shadow-md sm:h-48" />
//                                             <p className="truncate pt-1 text-center text-sm font-semibold leading-4">
//                                                 {movie.name}
//                                             </p>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </div>

//                         {/* Show Trailer if available */}
//                         {showTrailer && (
//                             <div className="mt-4 flex justify-center">
//                                 <iframe
//                                     width="560"
//                                     height="315"
//                                     src={showTrailer}
//                                     title="Movie Trailer"
//                                     allowFullScreen
//                                     className="rounded-lg shadow-lg"
//                                 ></iframe>
//                             </div>
//                         )}
//                     </>
//                 ) : (
//                     <p className="mt-4 text-center">There are no movies available</p>
//                 )
//             ) : (
//                 <Loading />
//             )}
//         </div>
//     );
// };

// export default NowShowing;


import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
    const [showTrailer, setShowTrailer] = useState(null);

    useEffect(() => {
        const storedIndex = sessionStorage.getItem('selectedMovieIndex');
        if (storedIndex !== null && movies[storedIndex]) {
            setSelectedMovieIndex(parseInt(storedIndex));
            setShowTrailer(movies[storedIndex]?.trailer || null);
        }
    }, [movies]);

    return (
        <div className="mx-4 flex flex-col rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 text-gray-900 drop-shadow-md sm:mx-8 sm:p-6">
            <h2 className="text-3xl font-bold">Now Showing</h2>

            {isFetchingMoviesDone ? (
                movies.length ? (
                    <>
                        <div className="mt-1 overflow-x-auto sm:mt-3">
                            <div className="mx-auto flex w-fit gap-4">
                                {movies.map((movie, index) => {
                                    const isSelected = selectedMovieIndex === index;
                                    
                                    return (
                                        <div
                                            key={index}
                                            title={movie.name}
                                            className={`flex w-[108px] flex-col rounded-md p-1 drop-shadow-md sm:w-[144px] 
                                                ${isSelected ? 'bg-gradient-to-br from-indigo-600 to-blue-500 text-white' : 'bg-white hover:from-indigo-500 hover:to-blue-400 hover:text-white'}
                                            `}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedMovieIndex(null);
                                                    setShowTrailer(null);
                                                    sessionStorage.removeItem('selectedMovieIndex');
                                                } else {
                                                    setSelectedMovieIndex(index);
                                                    setShowTrailer(movie.trailer || null);
                                                    sessionStorage.setItem('selectedMovieIndex', index.toString());
                                                }
                                            }}
                                        >
                                            <img src={movie.img} className="h-36 rounded-md object-cover drop-shadow-md sm:h-48" />
                                            <p className="truncate pt-1 text-center text-sm font-semibold leading-4">
                                                {movie.name}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Show Trailer if available */}
                        {showTrailer ? (
                            <div className="mt-4 flex justify-center">
                                <iframe
                                    width="560"
                                    height="315"
                                    src={showTrailer}
                                    title="Movie Trailer"
                                    allowFullScreen
                                    className="rounded-lg shadow-lg"
                                ></iframe>
                            </div>
                        ) : (
                            <p className="mt-4 text-center text-gray-600">Click on a movie to view its trailer.</p>
                        )}
                    </>
                ) : (
                    <p className="mt-4 text-center">There are no movies available</p>
                )
            ) : (
                <Loading />
            )}
        </div>
    );
};

export default NowShowing;
