import React from 'react'
import { Trophy, Clock } from 'lucide-react'

interface Bid {
	id: string
	store_name: string
	min_price?: number
	max_price?: number
	created_at: string
	is_winner?: boolean
}

interface BidRankingProps {
	bids: Bid[]
}

const BidRanking: React.FC<BidRankingProps> = ({ bids }) => {
	const sortedBids = bids.sort(
		(a, b) => (a.min_price || 0) - (b.min_price || 0)
	)
	return (
		<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
			<div className='px-6 py-4 bg-yellow-600 text-white'>
				<h2 className='text-lg font-bold flex items-center'>
					<Trophy className='h-5 w-5 mr-2' />
					入札ランキング
				</h2>
			</div>
			<div className='p-6'>
				{sortedBids.length === 0 ? (
					<div className='text-center py-8'>
						<div className='text-gray-400 mb-2'>
							<Trophy className='h-12 w-12 mx-auto opacity-50' />
						</div>
						<p className='text-gray-500 text-lg font-medium'>
							まだ入札がありません
						</p>
						<p className='text-gray-400 text-sm mt-2'>
							他の業者からの入札をお待ちください
						</p>
					</div>
				) : (
					<div className='space-y-3'>
						{sortedBids.map((bid, index) => (
							<div
								key={bid.id}
								className={`p-4 rounded-lg border-2 ${
									bid.is_winner
										? 'border-green-500 bg-green-50'
										: 'border-gray-200 bg-gray-50'
								}`}
							>
								<div className='flex items-center justify-between'>
									<div className='flex items-center'>
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
												index === 0
													? 'bg-yellow-500 text-white'
													: index === 1
													? 'bg-gray-400 text-white'
													: index === 2
													? 'bg-orange-600 text-white'
													: 'bg-gray-300 text-gray-700'
											}`}
										>
											{index + 1}
										</div>
										<div className='ml-3'>
											<p className='font-medium text-gray-900'>
												{bid.store_name}
												{bid.is_winner && (
													<span className='ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
														落札
													</span>
												)}
											</p>
											<p className='text-sm text-gray-600'>
												{bid.min_price?.toLocaleString() || '0'}円 〜{' '}
												{bid.max_price?.toLocaleString() || '0'}円
											</p>
										</div>
									</div>
									<div className='text-right'>
										<p className='text-sm text-gray-500 flex items-center'>
											<Clock className='h-4 w-4 mr-1' />
											{new Date(bid.created_at).toLocaleString('ja-JP')}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default BidRanking
