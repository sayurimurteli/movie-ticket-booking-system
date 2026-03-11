import { CheckIcon } from '@heroicons/react/24/outline'
import { memo, useState, useEffect } from 'react'
import axios from 'axios'

const Seat = ({ seat, setSelectedSeats, selectable, isAvailable }) => {
	const [isSelected, setIsSelected] = useState(false)
	const [price, setPrice] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				setIsLoading(true)
				const response = await axios.get(`/ticket-price/seat/${seat.row}/${seat.number}`)
				setPrice(response.data.data)
			} catch (error) {
				console.error('Error fetching seat price:', error)
			} finally {
				setIsLoading(false)
			}
		}

		if (isAvailable) {
			fetchPrice()
		}
	}, [seat.row, seat.number, isAvailable])

	const priceDisplay = price ? `₹${price.price}` : ''

	return !isAvailable ? (
		<button
			title={`${seat.row}${seat.number}`}
			className="flex h-8 w-8 cursor-not-allowed items-center justify-center"
		>
			<div className="h-6 w-6 rounded bg-gray-500 drop-shadow-md"></div>
		</button>
	) : isSelected ? (
		<button
			title={`${seat.row}${seat.number} - ${priceDisplay}`}
			className="flex h-8 w-8 items-center justify-center"
			onClick={() => {
				setIsSelected(false)
				setSelectedSeats((prev) => prev.filter((e) => e !== `${seat.row}${seat.number}`))
			}}
		>
			<div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500 drop-shadow-md">
				<CheckIcon className="h-5 w-5 stroke-[3] text-white" />
			</div>
			{price && (
				<div className="absolute -bottom-5 text-xs font-medium text-white">
					{priceDisplay}
				</div>
			)}
		</button>
	) : (
		<button
			title={`${seat.row}${seat.number} - ${priceDisplay}`}
			className={`flex h-8 w-8 items-center justify-center ${!selectable && 'cursor-not-allowed'}`}
			onClick={() => {
				if (selectable) {
					setIsSelected(true)
					setSelectedSeats((prev) => [...prev, `${seat.row}${seat.number}`])
				}
			}}
		>
			<div className="h-6 w-6 rounded bg-white drop-shadow-md"></div>
			{price && (
				<div className="absolute -bottom-5 text-xs font-medium text-white">
					{priceDisplay}
				</div>
			)}
		</button>
	)
}

export default memo(Seat)
