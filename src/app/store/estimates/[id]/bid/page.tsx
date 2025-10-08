import React from 'react'
import { cookies } from 'next/headers'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import EstimateNotFound from '@/components/common/EstimateNotFound'
import BidForm from '@/components/bid/BidForm'
import BidPageHeader from '@/components/bid/BidPageHeader'
import BidRanking from '@/components/common/BidRanking'
import BidRankingList from '@/components/common/BidRankingList'
import type { EstimateWithBidRanking } from '@/lib/actions/estimates'
import {
	getEstimateDetail,
	checkBidRight,
	getMyBid,
	getBidsByEstimate,
} from './data'

interface BidPageProps {
	params: Promise<{
		id: string
	}>
}

export default async function BidPage({ params }: BidPageProps) {
	// paramsを await してから使用
	const { id } = await params

	// cookieからメッセージを取得
	const cookieStore = await cookies()
	const successMessage = cookieStore.get('bid_success_message')?.value
	const errorMessage = cookieStore.get('bid_error_message')?.value

	// 並行してデータを取得
	const [estimateResponse, bidRightDataResponse, myBid, bids] =
		await Promise.all([
			getEstimateDetail(id),
			checkBidRight(id),
			getMyBid(id),
			getBidsByEstimate(id),
		])

	const estimate = estimateResponse.data as EstimateWithBidRanking | null
	const bidRightData = bidRightDataResponse.data

	if (!estimate) {
		return (
			<AuthLayout>
				<EstimateNotFound />
			</AuthLayout>
		)
	}
	console.log(estimate)
	// 入札データを価格順でソート（最低価格の安い順）
	const sortedBids = bids.sort((a, b) => a.min_price - b.min_price)

	return (
		<AuthLayout>
			<div className='min-h-screen bg-gray-50'>
				<SubHeader title='入札' />
				<Navigation />

				<main className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8'>
					<div className='px-4 py-6 sm:px-0'>
						<BidPageHeader estimateId={id} />

						<div className='grid grid-cols-2 gap-6 items-start'>
							{estimate &&
								estimate.bid_ranking_list &&
								estimate.bid_ranking_list.length > 0 && (
									<BidRankingList estimate={estimate} />
								)}
							<BidForm
								estimateId={id}
								bidRightData={bidRightData}
								existingBid={myBid}
								successMessage={successMessage}
								errorMessage={errorMessage}
							/>
						</div>
					</div>
				</main>
			</div>
		</AuthLayout>
	)
}
