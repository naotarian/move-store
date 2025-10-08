import { GoogleMapsLoader } from '@/components/maps/GoogleMapsLoader'
import { EstimateRouteMap } from '@/components/maps/EstimateRouteMap'
import { Estimate } from '@/types/estimate'
import { AddressInfo } from '@/components/common/EstimateDetail/AddressInfo'
import { MapPin, Home, Users, LucideIcon, Package } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { MovingDateType } from '@/constants/estimate'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
	getPeopleCountLabel,
	getWorkStartTimeTypeLabel,
	getWorkStartTimeLabel,
	WorkStartTimeType,
} from '@/constants/estimate'

// 共通のセクションヘッダーコンポーネント
const SectionHeader = ({
	icon: Icon,
	title,
}: {
	icon: LucideIcon
	title: string
}) => (
	<h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
		<Icon className='h-5 w-5' />
		{title}
	</h3>
)

// 共通のフィールド表示コンポーネント
const InfoField = ({
	label,
	value,
	className = '',
}: {
	label: string
	value: string | null | undefined
	className?: string
}) => (
	<div className={className}>
		<Label className='text-sm font-medium text-gray-700 mb-2 block'>
			{label}
		</Label>
		<p className='text-gray-700 bg-white p-3 rounded-md'>
			{value || 'データなし'}
		</p>
	</div>
)

// 日付フォーマット関数
const formatMovingDate = (estimate: Estimate): string => {
	if (
		estimate.moving_date_type === MovingDateType.DECIDED &&
		estimate.moving_specific_date
	) {
		const dateStr = new Date(estimate.moving_specific_date).toLocaleDateString(
			'ja-JP',
			{
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			}
		)
		const weekdayStr = new Date(estimate.moving_specific_date)
			.toLocaleDateString('ja-JP', { weekday: 'short' })
			.slice(0, 1)
		return `${dateStr} (${weekdayStr})`
	}

	if (
		estimate.moving_date_type === MovingDateType.UNDECIDED &&
		estimate.moving_year_month
	) {
		return `${estimate.moving_year_month} ${estimate.moving_period || ''}`
	}

	return ''
}

const EstimateDetail = ({ estimate }: { estimate: Estimate }) => {
	return (
		<div className='space-y-6 my-6'>
			{/* 引越し経路マップ */}
			<div className='mb-6 mt-6'>
				<GoogleMapsLoader>
					<EstimateRouteMap
						fromAddress={{
							zipcode: estimate.moving_from.zipcode,
							prefecture: estimate.moving_from.prefecture,
							street_address: estimate.moving_from.street_address,
							building_details: estimate.moving_from.building_details,
							latitude: estimate.moving_from.latitude,
							longitude: estimate.moving_from.longitude,
						}}
						toAddress={{
							zipcode: estimate.moving_to.zipcode,
							prefecture: estimate.moving_to.prefecture,
							street_address: estimate.moving_to.street_address,
							building_details: estimate.moving_to.building_details,
							latitude: estimate.moving_to.latitude,
							longitude: estimate.moving_to.longitude,
						}}
						straightDistance={estimate.straight_distance_km}
					/>
				</GoogleMapsLoader>
			</div>
			{/* 引っ越し元住所 */}
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>
						<SectionHeader icon={MapPin} title='引越し元住所' />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='mt-4 mb-4'>
						<AddressInfo address={estimate.moving_from} />
					</div>
				</CardContent>
			</Card>
			{/* 引越し先住所 */}
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>
						<SectionHeader icon={MapPin} title='引越し先住所' />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<AddressInfo address={estimate.moving_to} />
				</CardContent>
			</Card>
			{/* 人数・日程・時間 */}
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>
						<SectionHeader icon={Users} title='人数・日程・時間' />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='bg-gray-50 rounded-lg p-4 space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<InfoField
								label='引越し人数'
								value={getPeopleCountLabel(estimate.people_count)}
							/>
							<InfoField label='引越し日' value={formatMovingDate(estimate)} />
							<InfoField
								label='作業開始時間の指定'
								value={getWorkStartTimeTypeLabel(estimate.work_start_time_type)}
							/>
							{estimate.work_start_time_type === WorkStartTimeType.SPECIFIC && (
								<InfoField
									label='時間帯'
									value={getWorkStartTimeLabel(estimate.work_start_time)}
								/>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
			<Separator />
			{/* お荷物量 */}
			<Card className='mt-4'>
				<CardHeader>
					<CardTitle>
						<SectionHeader icon={Package} title='お荷物量' />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='bg-gray-50 rounded-lg p-4 space-y-4'>
						{estimate.luggage_by_category &&
						Object.keys(estimate.luggage_by_category).length > 0 ? (
							Object.entries(estimate.luggage_by_category).map(
								([categoryName, items]) => (
									<div key={categoryName} className='space-y-2'>
										<h4 className='font-medium text-gray-800 border-b border-gray-300 pb-1'>
											{categoryName}
										</h4>
										<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-end'>
											{items.map((item, index) => (
												<div
													key={`${categoryName}-${index}`}
													className='bg-white p-2 rounded text-sm'
												>
													<div className='flex justify-between items-center'>
														<span className='text-gray-700 pr-2'>
															{item.name}
															<br />
															{item.sub_label && (
																<span className='text-xs text-gray-500 ml-1'>
																	({item.sub_label})
																</span>
															)}
														</span>
														<span className='text-blue-600 font-medium whitespace-nowrap'>
															数量 : {item.quantity}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								)
							)
						) : (
							<div className='text-center py-4'>
								<p className='text-gray-500'>荷物情報がありません</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
			{estimate.other_luggage && (
				<Card className='mt-4'>
					<CardHeader>
						<CardTitle>
							<SectionHeader icon={Package} title='上記以外の家財' />
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-2'>
							<div className='bg-white p-3 rounded'>
								<p className='text-gray-700 text-sm'>
									{estimate.other_luggage}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}

export default EstimateDetail
