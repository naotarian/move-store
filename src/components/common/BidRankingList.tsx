import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Trophy, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { EstimateWithBidRanking } from '@/lib/actions/estimates'
import { Medal, Award } from 'lucide-react'

interface BidRankingListProps {
	estimate: EstimateWithBidRanking
}

const BidRankingList = ({ estimate }: BidRankingListProps) => {
	return (
		<Card className='bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-200 shadow-lg'>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-3'>
					<div className='flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full'>
						<Trophy className='h-6 w-6 text-amber-600' />
					</div>
					<div>
						<CardTitle className='text-amber-800 text-xl font-semibold flex items-center gap-2'>
							入札ランキング
							<TrendingUp className='h-5 w-5 text-amber-600' />
						</CardTitle>
						<p className='text-amber-600 text-sm mt-1'>現在の入札状況と順位</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className='space-y-3'>
				{estimate.bid_ranking_list.map((bid) => {
					const getRankIcon = (rank: number) => {
						switch (rank) {
							case 1:
								return <Trophy className='h-5 w-5 text-yellow-500' />
							case 2:
								return <Medal className='h-5 w-5 text-gray-400' />
							case 3:
								return <Award className='h-5 w-5 text-amber-600' />
							default:
								return (
									<div className='w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600'>
										{rank}
									</div>
								)
						}
					}

					const getRankBgColor = (rank: number) => {
						switch (rank) {
							case 1:
								return 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300'
							case 2:
								return 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300'
							case 3:
								return 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300'
							default:
								return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
						}
					}

					return (
						<div
							key={bid.store_id}
							className={`relative p-4 rounded-lg border-2 ${getRankBgColor(
								bid.rank
							)} transition-all duration-200 hover:shadow-md`}
						>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-4'>
									{/* ランクアイコン */}
									<div className='flex items-center gap-2'>
										{getRankIcon(bid.rank)}
										<span className='font-bold text-lg text-gray-800'>
											{bid.rank}位
										</span>
										{bid.is_tie && (
											<Badge
												variant='secondary'
												className='text-xs bg-blue-100 text-blue-800'
											>
												同率
											</Badge>
										)}
									</div>

									{/* 店舗名 */}
									<div>
										<h4 className='font-semibold text-gray-900 text-lg'>
											{bid.store_name}
										</h4>
									</div>
								</div>
							</div>
							{/* 入札金額 */}
							<div className='text-right'>
								<div className='flex items-center justify-end gap-2'>
									<p className='text-sm text-gray-600'>入札金額</p>
									<p className='font-bold text-xl text-gray-900'>
										¥{bid.min.toLocaleString()}
									</p>
									{bid.min !== bid.max && (
										<p className='text-sm text-gray-500'>
											〜 ¥{bid.max.toLocaleString()}
										</p>
									)}
								</div>
							</div>

							{/* 1位の場合の特別表示 */}
							{bid.rank === 1 && (
								<div className='absolute -top-2 -right-2'>
									<div className='bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-md'>
										最安入札
									</div>
								</div>
							)}
						</div>
					)
				})}

				{/* 入札総数の表示 */}
				<div className='mt-6 pt-4 border-t border-amber-200'>
					<div className='flex items-center justify-center gap-2 text-amber-700 bg-amber-100/50 px-4 py-2 rounded-lg'>
						<Trophy className='h-4 w-4' />
						<span className='text-sm font-medium'>
							総入札数: {estimate.bid_ranking_list.length}件
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default BidRankingList
