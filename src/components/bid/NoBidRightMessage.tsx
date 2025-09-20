import React from 'react'
import { Lock, CreditCard, AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BidRightData } from '@/app/store/estimates/[id]/bid/data'

interface NoBidRightMessageProps {
	estimateId: string
	bidRightData: BidRightData
}

const NoBidRightMessage: React.FC<NoBidRightMessageProps> = ({
	estimateId,
	bidRightData,
}) => {
	const estimateInfo = bidRightData?.estimate_info
	console.log('iiiiii')

	// 日時をフォーマットする関数
	const formatDateTime = (dateString?: string) => {
		if (!dateString) return null
		try {
			const date = new Date(dateString)
			return date.toLocaleString('ja-JP', {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
		} catch {
			return null
		}
	}

	// 購入期限切れかどうかをチェック
	console.log(estimateInfo?.is_purchase_deadline_expired)
	const isPurchaseExpired = estimateInfo?.is_purchase_deadline_expired
	const remainingMinutes = estimateInfo?.remaining_purchase_minutes
	const remainingBidHours = estimateInfo?.remaining_bid_hours

	// 残り時間を時間と分で表示する関数（分単位）
	const formatRemainingTime = (minutes?: number) => {
		if (!minutes || minutes <= 0) return null

		if (minutes >= 60) {
			const hours = Math.floor(minutes / 60)
			const mins = minutes % 60
			return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`
		}
		return `${minutes}分`
	}

	// 残り時間を表示する関数（時間単位）
	const formatRemainingHours = (hours?: number) => {
		if (!hours || hours <= 0) return null
		return `${hours}時間`
	}
	return (
		<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
			<div className='px-6 py-4 bg-gray-500 text-white'>
				<h2 className='text-lg font-bold flex items-center'>
					<Lock className='h-5 w-5 mr-2' />
					入札権が必要です
				</h2>
			</div>
			<div className='p-6'>
				<div className='text-center space-y-4'>
					<div className='w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center'>
						<AlertCircle className='h-8 w-8 text-gray-400' />
					</div>
					<div>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>
							この見積もりに入札するには入札権の購入が必要です
						</h3>
						<p className='text-gray-600 text-sm mb-4'>
							入札権を購入することで、この見積もりに対して入札を行うことができます。
							入札権は見積もりごとに必要となります。
						</p>
					</div>
					{/* 期限情報の表示 */}
					{estimateInfo && (
						<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
							<div className='flex items-start'>
								<div className='flex-shrink-0'>
									<Clock className='h-5 w-5 text-yellow-500 mt-0.5' />
								</div>
								<div className='ml-3 text-left'>
									<h4 className='text-sm font-medium text-yellow-800'>
										期限情報
									</h4>
									<div className='mt-2 text-sm text-yellow-700 space-y-1'>
										{estimateInfo.bid_deadline && (
											<div>
												入札期限: {formatDateTime(estimateInfo.bid_deadline)}
												{formatRemainingHours(remainingBidHours) && (
													<span className='ml-2 text-xs'>
														(あと{formatRemainingHours(remainingBidHours)})
													</span>
												)}
											</div>
										)}
										{estimateInfo.purchase_deadline && (
											<div>
												購入期限:{' '}
												{formatDateTime(estimateInfo.purchase_deadline)}
												{formatRemainingTime(remainingMinutes) && (
													<span className='ml-2 text-xs'>
														(あと{formatRemainingTime(remainingMinutes)})
													</span>
												)}
											</div>
										)}
										{isPurchaseExpired && (
											<div className='text-red-600 font-medium'>
												⚠️ 入札権の購入期限が過ぎています
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					)}

					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
						<div className='flex items-start'>
							<div className='flex-shrink-0'>
								<CreditCard className='h-5 w-5 text-blue-400 mt-0.5' />
							</div>
							<div className='ml-3 text-left'>
								<h4 className='text-sm font-medium text-blue-900'>
									入札権について
								</h4>
								<ul className='mt-2 text-sm text-blue-700 space-y-1'>
									<li>• 1つの見積もりにつき1つの入札権が必要</li>
									<li>• 入札権購入後、即座に入札可能</li>
									<li>• 購入期限は入札期限の15分前まで</li>
								</ul>
							</div>
						</div>
					</div>
					<div className='pt-2'>
						{isPurchaseExpired ? (
							<Button
								type='button'
								disabled
								className='bg-gray-400 text-white px-8 py-2 cursor-not-allowed'
							>
								<CreditCard className='h-4 w-4 mr-2' />
								購入期限終了
							</Button>
						) : (
							<Button
								type='button'
								asChild
								className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-2'
							>
								<a href={`/store/estimates/${estimateId}/bid/purchase`}>
									<CreditCard className='h-4 w-4 mr-2' />
									入札権を購入する
								</a>
							</Button>
						)}
						<p className='text-xs text-gray-500 mt-2'>
							{isPurchaseExpired
								? '※ 入札権の購入期限が過ぎているため、購入できません'
								: '※ 購入手続きは安全に暗号化されています'}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NoBidRightMessage
