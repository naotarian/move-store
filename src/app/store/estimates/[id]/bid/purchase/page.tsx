import React from 'react'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import EstimateNotFound from '@/components/common/EstimateNotFound'
import BidRightPurchaseForm from '@/components/bid/BidRightPurchaseForm'
import BidPageHeader from '@/components/bid/BidPageHeader'
import { getEstimateDetail } from '@/lib/actions/estimates'
import { getCurrentStoreId } from '@/lib/auth'
import { checkBidRight } from '@/lib/actions/bid-rights'
import { redirect } from 'next/navigation'

interface PurchasePageProps {
	params: Promise<{
		id: string
	}>
}

export default async function PurchasePage({ params }: PurchasePageProps) {
	// paramsを await
	const { id } = await params

	// データ取得
	const estimateResponse = await getEstimateDetail(id)
	const estimate = estimateResponse.data

	if (!estimate) {
		return (
			<AuthLayout>
				<EstimateNotFound />
			</AuthLayout>
		)
	}

	// ログイン中のstoreIDを取得
	const storeId = await getCurrentStoreId()

	// 入札権確認（既に購入済みの場合は入札ページにリダイレクト）
	const bidRightResponse = await checkBidRight(id, storeId)
	if (bidRightResponse.hasBidRight) {
		redirect(`/store/estimates/${id}/bid`)
	}

	return (
		<AuthLayout>
			<div className='min-h-screen bg-gray-50'>
				<SubHeader title='入札権購入' />
				<Navigation />

				<main className='max-w-4xl mx-auto py-6 sm:px-6 lg:px-8'>
					<div className='px-4 py-6 sm:px-0'>
						<BidPageHeader estimateId={id} />

						<div className='space-y-6'>
							<BidRightPurchaseForm
								estimateId={id}
								storeId={storeId}
								estimate={estimate}
							/>
						</div>
					</div>
				</main>
			</div>
		</AuthLayout>
	)
}
