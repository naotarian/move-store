import React from 'react'
import { Eye, Gavel } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EstimateListItem } from '@/lib/actions/estimates'
import {
	formatMovingDate,
	formatWorkStartTime,
	formatPeopleCount,
} from '@/utils/estimateFormatters'

interface EstimatesTableProps {
	estimates: EstimateListItem[]
}

export function EstimatesTable({ estimates }: EstimatesTableProps) {
	return (
		<div className='bg-white shadow overflow-hidden sm:rounded-md'>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								引越し元
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								引越し先
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								引越し日
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								人数・時間
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								作成日
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								入札金額
							</th>
							<th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								操作
							</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{estimates.map((estimate) => {
							return (
								<tr key={estimate.id} className='hover:bg-gray-50'>
									<td className='px-3 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-900'>
											{estimate.moving_from.prefecture}{' '}
											{estimate.moving_from.city}
										</div>
										<div className='text-sm text-gray-500'>
											{estimate.moving_from.street_address}
											{estimate.moving_from.building_name && (
												<span> {estimate.moving_from.building_name}</span>
											)}
										</div>
									</td>
									<td className='px-3 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-900'>
											{estimate.moving_to.prefecture} {estimate.moving_to.city}
										</div>
										<div className='text-sm text-gray-500'>
											{estimate.moving_to.street_address}
											{estimate.moving_to.building_name && (
												<span> {estimate.moving_to.building_name}</span>
											)}
										</div>
									</td>
									<td className='px-3 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-900'>
											{formatMovingDate(estimate)}
										</div>
									</td>
									<td className='px-3 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-900'>
											{formatPeopleCount(estimate.people_count)}
										</div>
										<div className='text-sm text-gray-500'>
											{formatWorkStartTime(estimate)}
										</div>
									</td>
									<td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
										{new Date(estimate.created_at).toLocaleDateString('ja-JP')}
									</td>
									<td className='px-3 py-4 whitespace-nowrap text-sm font-medium'>
										{estimate.has_bid ? (
											<div className='text-sm text-gray-900 font-medium text-center'>
												{estimate.bid_amount_min && estimate.bid_amount_max
													? `${estimate.bid_amount_min.toLocaleString()}円 - ${estimate.bid_amount_max.toLocaleString()}円`
													: '入札なし'}
											</div>
										) : (
											<div className='text-sm text-gray-900 font-medium text-center'>
												入札なし
											</div>
										)}
									</td>
									<td className='px-3 py-4 whitespace-nowrap text-sm font-medium'>
										<div className='flex items-end space-x-2'>
											<Button asChild variant='outline' size='sm'>
												<Link
													href={`/store/estimates/${estimate.id}`}
													className='flex items-center'
												>
													<Eye className='h-4 w-4 mr-1' />
													詳細
												</Link>
											</Button>
											{estimate.has_bid_right && (
												<Button asChild variant='default' size='sm'>
													<Link
														href={`/store/estimates/${estimate.id}/bid`}
														className='flex items-center'
													>
														<Gavel className='h-4 w-4 mr-1' />
														入札
													</Link>
												</Button>
											)}
											{!estimate.has_bid_right && (
												<div>
													<p className='text-red-500 text-xs mb-1'>
														(入札権がありません)
													</p>
													<Button asChild variant='default' size='sm'>
														<Link
															href={`/store/estimates/${estimate.id}/bid`}
															className='flex items-center'
														>
															<Gavel className='h-4 w-4 mr-1' />
															入札権購入
														</Link>
													</Button>
												</div>
											)}
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}
