import { cookies } from 'next/headers'

interface CreateCheckoutSessionParams {
	estimateId: string
	storeId: string
	price: number
	successUrl: string
	cancelUrl: string
}

interface CheckoutSessionResponse {
	success: boolean
	checkoutUrl?: string
	error?: string
}

export async function createStripeCheckoutSession(
	params: CreateCheckoutSessionParams
): Promise<string | null> {
	try {
		console.log('Creating Stripe checkout session with params:', params)
		console.log('API_BASE_URL:', process.env.API_BASE_URL)

		const cookieStore = await cookies()
		const token = cookieStore.get('store_token')?.value

		if (!token) {
			throw new Error('認証トークンが見つかりません。ログインしてください。')
		}

		const response = await fetch(
			`${process.env.API_BASE_URL}/api/stripe/create-checkout-session`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					estimate_id: params.estimateId,
					store_id: params.storeId,
					price: params.price,
					success_url: params.successUrl,
					cancel_url: params.cancelUrl,
					product_name: '入札権',
					product_description: `見積もり ${params.estimateId} への入札権`,
				}),
			}
		)

		if (!response.ok) {
			throw new Error(`Stripe API request failed: ${response.status}`)
		}

		const data = await response.json()
		console.log('Stripe API response:', data)

		if (data.success && data.checkout_url) {
			console.log('Checkout URL created:', data.checkout_url)
			return data.checkout_url
		}

		console.error('Failed to create checkout session:', data.error)
		throw new Error(
			data.error || 'チェックアウトセッションの作成に失敗しました'
		)
	} catch (error) {
		console.error('Stripe チェックアウトセッション作成エラー:', error)
		return null
	}
}

export async function handleStripeWebhook(
	signature: string,
	payload: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch(
			`${process.env.API_BASE_URL}/api/stripe/webhook`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Stripe-Signature': signature,
				},
				body: payload,
			}
		)

		if (!response.ok) {
			throw new Error(`Webhook処理に失敗: ${response.status}`)
		}

		const data = await response.json()
		return { success: data.success }
	} catch (error) {
		console.error('Stripe Webhook処理エラー:', error)
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Webhook処理に失敗しました',
		}
	}
}
