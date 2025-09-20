import { cookies } from 'next/headers'

interface BidRightResponse {
	hasBidRight: boolean
	error?: string
}

export async function checkBidRight(
	estimateId: string,
	storeId: string
): Promise<BidRightResponse> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('store_token')?.value
		console.log('token', token)

		if (!token) {
			throw new Error('認証トークンが見つかりません。ログインしてください。')
		}
		// TODO: 実際のAPI URLに置き換える
		console.log(`${process.env.API_BASE_URL}/api/estimate-bid-rights/check`)
		const response = await fetch(
			`${process.env.API_BASE_URL}/api/store/estimate-bid-rights/check`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`, // 認証トークン
				},
				body: JSON.stringify({
					estimate_id: estimateId,
					store_id: storeId,
				}),
			}
		)

		if (!response.ok) {
			if (response.status === 403) {
				return {
					hasBidRight: false,
					error: '入札権がありません',
				}
			}
			throw new Error(`API request failed: ${response.status}`)
		}

		await response.json()

		return {
			hasBidRight: true,
		}
	} catch (error) {
		console.error('入札権確認エラー:', error)
		return {
			hasBidRight: false,
			error:
				error instanceof Error ? error.message : '入札権の確認に失敗しました',
		}
	}
}

export async function purchaseBidRight(
	estimateId: string,
	storeId: string
): Promise<BidRightResponse> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get('store_token')?.value

		if (!token) {
			throw new Error('認証トークンが見つかりません。ログインしてください。')
		}
		const response = await fetch(
			`${process.env.API_BASE_URL}/api/estimate-bid-rights/purchase`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					estimate_id: estimateId,
					store_id: storeId,
				}),
			}
		)

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`)
		}

		const data = await response.json()

		return {
			success: true,
			data: {
				hasBidRight: true,
				bidRightId: data.bid_right_id,
				purchaseDate: data.purchase_date,
			},
		}
	} catch (error) {
		console.error('入札権購入エラー:', error)
		return {
			success: false,
			error:
				error instanceof Error ? error.message : '入札権の購入に失敗しました',
		}
	}
}
