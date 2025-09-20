import React from 'react'
import { CreditCard, Shield, ArrowRight, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createStripeCheckoutSession } from '@/lib/actions/stripe'
import { redirect } from 'next/navigation'

interface BidRightPurchaseFormProps {
	estimateId: string
	storeId: string
	estimate: any // TODO: 適切な型定義
}

const BidRightPurchaseForm: React.FC<BidRightPurchaseFormProps> = ({
	estimateId,
	storeId,
	estimate,
}) => {
	const bidRightPrice = 500 // 入札権の価格（円）

	async function handlePurchase() {
		'use server'

		try {
			// Stripe Checkout セッションを作成
			const apiBaseUrl = process.env.CLIENT_API_BASE_URL
			const checkoutUrl = await createStripeCheckoutSession({
				estimateId,
				storeId,
				price: bidRightPrice,
				successUrl: `${apiBaseUrl}/api/store/payment/${estimateId}/${storeId}?purchase=success`,
				cancelUrl: `http://localhost:3000/store/estimates/${estimateId}/bid/purchase?purchase=cancelled`,
			})

			// Stripe Checkoutページにリダイレクト
			if (checkoutUrl) {
				redirect(checkoutUrl)
			}
		} catch (error) {
			console.error('決済セッション作成エラー:', error)
			// TODO: エラーハンドリングを実装
			throw error
		}
	}

	return (
		<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
			<div className='px-6 py-4 bg-blue-600 text-white'>
				<h2 className='text-lg font-bold flex items-center'>
					<CreditCard className='h-5 w-5 mr-2' />
					入札権を購入
				</h2>
			</div>
			<div className='p-6'>
				{/* 見積もり情報 */}
				<div className='mb-6 p-4 bg-gray-50 rounded-lg'>
					<h3 className='font-medium text-gray-900 mb-2'>見積もり情報</h3>
					<div className='text-sm text-gray-600 space-y-1'>
						<p>見積もりID: {estimateId}</p>
						<p>引越し予定日: {estimate.moving_date || '未定'}</p>
						<p>引越し元: {estimate.moving_from?.prefecture || '未定'}</p>
						<p>引越し先: {estimate.moving_to?.prefecture || '未定'}</p>
					</div>
				</div>

				{/* 価格情報 */}
				<div className='mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50'>
					<div className='flex justify-between items-center'>
						<span className='text-lg font-medium text-gray-900'>
							入札権価格
						</span>
						<span className='text-2xl font-bold text-blue-600'>
							¥{bidRightPrice.toLocaleString()}
						</span>
					</div>
					<p className='text-sm text-gray-600 mt-2'>
						※ この見積もりに対する入札権限を取得できます
					</p>
				</div>

				{/* 注意事項 */}
				<div className='mb-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50'>
					<div className='flex items-start'>
						<Info className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
						<div className='ml-3'>
							<h4 className='text-sm font-medium text-yellow-800'>
								入札権について
							</h4>
							<ul className='mt-2 text-sm text-yellow-700 space-y-1'>
								<li>• 入札権は見積もりごとに必要です</li>
								<li>• 購入後すぐに入札が可能になります</li>
								<li>• 返金は受け付けておりません</li>
								<li>• 入札が成約しなかった場合でも返金されません</li>
							</ul>
						</div>
					</div>
				</div>

				{/* セキュリティ情報 */}
				<div className='mb-6 flex items-center justify-center text-sm text-gray-500'>
					<Shield className='h-4 w-4 mr-2' />
					<span>Stripeによる安全な決済処理</span>
				</div>

				{/* 購入ボタン */}
				<form action={handlePurchase}>
					<Button
						type='submit'
						className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg'
					>
						<CreditCard className='h-5 w-5 mr-2' />
						Stripeで決済する
						<ArrowRight className='h-5 w-5 ml-2' />
					</Button>
				</form>

				<p className='text-xs text-gray-500 text-center mt-4'>
					※ クリックするとStripeの決済ページに移動します
				</p>
			</div>
		</div>
	)
}

export default BidRightPurchaseForm
