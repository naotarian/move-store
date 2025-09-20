import React from 'react'
import { ArrowLeft } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import Link from 'next/link'
import { getEstimateDetail } from '@/lib/actions/estimates'
import {
	formatMovingDate,
	formatWorkStartTime,
	formatPeopleCount,
} from '@/utils/estimateFormatters'
import { GoogleMapsLoader } from '@/components/maps/GoogleMapsLoader'
import { EstimateRouteMap } from '@/components/maps/EstimateRouteMap'

interface EstimateDetailPageProps {
	params: Promise<{
		id: string
	}>
}

export default async function EstimateDetailPage({
	params,
}: EstimateDetailPageProps) {
	try {
		// paramsをawaitする（Next.js 15の要件）
		const { id } = await params

		// Server Actionを使用してデータを取得
		const estimateResponse = await getEstimateDetail(id)
		const estimate = estimateResponse.data

		// デバッグ用ログ
		console.log('Estimate data:', estimate)
		console.log('Luggage items:', estimate?.luggage_items)

		if (!estimate) {
			return (
				<AuthLayout>
					<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
						<div className='text-center'>
							<h1 className='text-2xl font-bold text-gray-900 mb-4'>
								見積もりが見つかりません
							</h1>
							<p className='text-gray-600 mb-8'>
								指定された見積もりは存在しないか、アクセス権限がありません。
							</p>
							<Link
								href='/store/estimates'
								className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#003672] hover:bg-[#5c6f8b] transition-colors duration-200'
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								一覧に戻る
							</Link>
						</div>
					</div>
				</AuthLayout>
			)
		}

		return (
			<AuthLayout>
				<div className='min-h-screen bg-gray-50'>
					<SubHeader title='見積もり詳細' />
					<Navigation />

					{/* メインコンテンツ */}
					<main className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8'>
						<div className='px-4 py-6 sm:px-0'>
							{/* 戻るボタン */}
							<div className='mb-6'>
								<Link
									href='/store/estimates'
									className='inline-flex items-center text-gray-600 hover:text-gray-900'
								>
									<ArrowLeft className='h-5 w-5 mr-1' />
									一覧に戻る
								</Link>
							</div>

							{/* 引越し経路マップ */}
							<div className='mb-6'>
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

							<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
								{/* 引越し元住所セクション */}
								<div className='border-b border-gray-200 p-6'>
									<h2 className='text-xl font-bold text-[#003672] mb-4'>
										引越し元住所
									</h2>

									<div className='space-y-4'>
										<div>
											<h3 className='text-sm font-medium text-[#003672] mb-2'>
												住所情報
											</h3>
											<div className='space-y-2'>
												<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
													〒{estimate.moving_from.zipcode}
												</p>
												<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
													{estimate.moving_from.prefecture}{' '}
													{estimate.moving_from.city}
												</p>
												<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
													{estimate.moving_from.street_address}
												</p>
												{estimate.moving_from.building_details && (
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_from.building_details}
													</p>
												)}
											</div>
										</div>

										<div>
											<h3 className='text-sm font-medium text-[#003672] mb-2'>
												建物情報
											</h3>
											<div className='grid md:grid-cols-2 gap-4'>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														建物のタイプ
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_from.building_type}
													</p>
												</div>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														間取り
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_from.floor_plan}
													</p>
												</div>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														お住まいの階数
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_from.floor_number}
													</p>
												</div>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														エレベーター
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_from.has_elevator}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* 引越し先住所セクション */}
								<div className='border-b border-gray-200 p-6'>
									<h2 className='text-xl font-bold text-[#003672] mb-4'>
										引越し先住所
									</h2>

									<div className='space-y-4'>
										<div>
											<h3 className='text-sm font-medium text-[#003672] mb-2'>
												住所情報
											</h3>
											<div className='space-y-2'>
												<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
													〒{estimate.moving_to.zipcode}
												</p>
												<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
													{estimate.moving_to.prefecture}{' '}
													{estimate.moving_to.city}
												</p>
												<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
													{estimate.moving_to.street_address}
												</p>
												{estimate.moving_to.building_details && (
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_to.building_details}
													</p>
												)}
											</div>
										</div>

										<div>
											<h3 className='text-sm font-medium text-[#003672] mb-2'>
												建物情報
											</h3>
											<div className='grid md:grid-cols-2 gap-4'>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														建物のタイプ
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_to.building_type}
													</p>
												</div>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														間取り
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_to.floor_plan}
													</p>
												</div>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														お住まいの階数
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_to.floor_number}
													</p>
												</div>
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														エレベーター
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{estimate.moving_to.has_elevator}
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* 人数・日程・時間セクション */}
								<div className='border-b border-gray-200 p-6'>
									<h2 className='text-xl font-bold text-[#003672] mb-4'>
										人数・日程・時間
									</h2>

									<div className='space-y-4'>
										<div>
											<h3 className='text-sm font-medium text-[#003672] mb-2'>
												引越し人数
											</h3>
											<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
												{formatPeopleCount(estimate.people_count)}
											</p>
										</div>

										<div>
											<h3 className='text-sm font-medium text-[#003672] mb-2'>
												引越し日
											</h3>
											<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
												{formatMovingDate(estimate)}
											</p>
										</div>

										<div>
											<h3 className='text-sm font-medium text-[#003672] mb-2'>
												作業開始時間
											</h3>
											<p className='text-gray-700 bg-gray-50 p-3 rounded-md mb-2'>
												{estimate.work_start_time_type === 'anytime'
													? 'いつでも'
													: '指定する'}
											</p>
											{estimate.work_start_time_type === 'specific' && (
												<div>
													<label className='block text-xs font-medium text-gray-600 mb-1'>
														時間帯
													</label>
													<p className='text-gray-700 bg-gray-50 p-3 rounded-md'>
														{formatWorkStartTime(estimate)}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* お荷物量セクション */}
								<div className='border-b border-gray-200 p-6'>
									<h2 className='text-xl font-bold text-[#003672] mb-4'>
										お荷物量
									</h2>

									{estimate.luggage_items &&
									estimate.luggage_items.length > 0 ? (
										<div className='space-y-6'>
											{/* カテゴリー別にグループ化 */}
											{Object.entries(
												estimate.luggage_items.reduce(
													(acc: { [key: string]: any[] }, item) => {
														const category = item.luggage?.category || 'その他'
														if (!acc[category]) acc[category] = []
														acc[category].push(item)
														return acc
													},
													{}
												)
											).map(([category, items]) => (
												<div key={category} className='space-y-4'>
													<h3 className='text-lg font-semibold text-[#003672] border-b border-gray-200 pb-2'>
														{category}
													</h3>
													<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
														{items.map((item) => (
															<div
																key={item.id}
																className='border border-gray-200 rounded-lg p-4'
															>
																<div className='flex items-start justify-between gap-3'>
																	<div className='flex-1 min-w-0'>
																		<h4 className='font-medium text-gray-900 break-words'>
																			{item.luggage?.name || '不明な荷物'}
																		</h4>
																	</div>
																	<div className='bg-[#003672] text-white px-3 py-1 rounded-full text-sm font-medium flex-shrink-0'>
																		数量 : {item.quantity}
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											))}
										</div>
									) : (
										<p className='text-gray-500 text-center py-8'>
											選択された荷物はありません
										</p>
									)}

									{estimate.other_luggage && (
										<div className='mt-6 pt-6 border-t border-gray-200'>
											<h3 className='text-lg font-semibold text-[#003672] mb-4'>
												上記以外の家財
											</h3>
											<div className='bg-gray-50 p-4 rounded-lg'>
												<p className='text-gray-700 whitespace-pre-wrap'>
													{estimate.other_luggage}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</main>
				</div>
			</AuthLayout>
		)
	} catch (error) {
		console.error('Server Action error:', error)
		// エラーは自動的にerror.tsxで処理される
		throw error
	}
}
