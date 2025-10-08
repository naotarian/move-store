import React from 'react'
import {
	ArrowLeft,
	CheckCircle,
	ExternalLink,
	Sparkles,
	Trophy,
	Medal,
	Award,
	TrendingUp,
} from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import Link from 'next/link'
import { getEstimateDetail } from '@/lib/actions/estimates'
import EstimateDetail from '@/components/common/EstimateDetail/EstimateDetail'
import BitRightDialog from '@/components/common/BitRightDialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import BidRankingList from '@/components/common/BidRankingList'

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
		console.log(estimate)

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
							{!estimate.has_bid_right && (
								<BitRightDialog estimateId={estimate.id} />
							)}
							{estimate.has_bid_right && (
								<Card className='my-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300'>
									<CardHeader className='pb-4'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center space-x-3'>
												<div className='flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full'>
													<CheckCircle className='h-6 w-6 text-emerald-600' />
												</div>
												<div>
													<CardTitle className='text-emerald-800 text-xl font-semibold flex items-center gap-2'>
														入札権取得済み
														<Sparkles className='h-5 w-5 text-emerald-600' />
													</CardTitle>
													<p className='text-emerald-600 text-sm mt-1'>
														この見積もりへの入札が可能です
													</p>
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent className='pt-0'>
										<div className='bg-white/70 rounded-lg p-4 border border-emerald-100'>
											<div className='flex items-center justify-between'>
												<div>
													<h4 className='font-medium text-gray-900 mb-1'>
														入札を開始しましょう
													</h4>
													<p className='text-sm text-gray-600'>
														競合他社よりも魅力的な提案で営業権を獲得しましょう
													</p>
												</div>
												<Button
													asChild
													size='lg'
													className='bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2'
												>
													<a
														href={`/store/estimates/${estimate.id}/bid`}
														target='_blank'
														rel='noopener noreferrer'
													>
														入札する
														<ExternalLink className='h-4 w-4' />
													</a>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							)}
							<EstimateDetail estimate={estimate} />
							<Separator />

							{estimate.bid_ranking_list &&
								estimate.bid_ranking_list.length > 0 && (
									<BidRankingList estimate={estimate} />
								)}
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
