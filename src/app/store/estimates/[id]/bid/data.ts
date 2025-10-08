import { getCurrentStoreId } from '@/lib/auth'
import apiClient from '@/lib/api-client'
import type { EstimateDetailResponse } from '@/lib/actions/estimates'

// 見積もり詳細データの型定義
export interface EstimateDetail {
	id: string
	name: string
	email: string
	phone: string
	moveDate: string
	fromAddress: string
	toAddress: string
	status: string
	createdAt: string
	luggageItems: Array<{
		category: string
		items: Array<{
			name: string
			quantity: number
		}>
	}>
}

// 入札権確認データの型定義
export interface BidRightData {
	hasBidRight: boolean
	purchaseDate?: string
	expiresAt?: string
	estimate_info?: {
		id: string
		status: string
		bid_deadline?: string
		purchase_deadline?: string
		is_within_purchase_deadline: boolean
		is_purchase_deadline_expired: boolean
		remaining_purchase_minutes?: number
		is_within_bid_deadline: boolean
		is_bid_deadline_expired: boolean
		remaining_bid_hours?: number
	}
}

// 入札データの型定義
export interface BidData {
	id: string
	store_id: string
	store_name: string
	min_price: number
	max_price: number
	message?: string
	created_at: string
	is_winner?: boolean
}

/**
 * 見積もり詳細を取得
 */
export async function getEstimateDetail(
	estimateId: string
): Promise<{ data: EstimateDetailResponse | null }> {
	try {
		const result = await apiClient.getJson<{ data: EstimateDetailResponse }>(
			`/api/estimate/${estimateId}`
		)
		return { data: result.data }
	} catch (error) {
		console.error('Get estimate detail error:', error)
		// 404エラーの場合はnullを返す
		if (error instanceof Error && error.message.includes('404')) {
			return { data: null }
		}
		return { data: null }
	}
}

/**
 * 入札権の確認
 */
export async function checkBidRight(
	estimateId: string
): Promise<{ data: BidRightData }> {
	try {
		const storeId = await getCurrentStoreId()

		const result = await apiClient.postJson<{ data: BidRightData }>(
			'/api/store/estimate-bid-rights/check',
			{
				estimate_id: estimateId,
				store_id: storeId,
			}
		)

		// レスポンスの構造を検証
		if (!result?.data || typeof result.data.hasBidRight !== 'boolean') {
			return { data: { hasBidRight: false } }
		}

		return { data: result.data }
	} catch (error: any) {
		// 入札権確認APIでの403エラー（入札権なし）は正常な業務フローなので、エラーログを出さない
		if (error?.status === 403) {
			console.log('入札権確認: 入札権がありません（購入が必要）')
			// 403レスポンスのdataを取得、なければデフォルト値
			return error?.response?.data || { hasBidRight: false }
		}

		// 403以外のエラーはログに記録
		console.error('Check bid right error:', error)

		// その他のエラーの場合は、入札権なしとして扱う
		return { data: { hasBidRight: false } }
	}
}

/**
 * この見積もりの入札一覧を取得
 */
export async function getBidsByEstimate(
	estimateId: string
): Promise<BidData[]> {
	try {
		const result = await apiClient.getJson<{ data: BidData[] }>(
			`/api/store/estimates/${estimateId}/bids`
		)
		return result.data || []
	} catch (error) {
		console.error('Get bids error:', error)
		return []
	}
}

/**
 * 自分の入札を取得
 */
export async function getMyBid(estimateId: string): Promise<BidData | null> {
	try {
		const result = await apiClient.getJson<{ data: BidData | null }>(
			`/api/store/estimates/${estimateId}/bids/my`
		)
		// data が null の場合は入札がない
		return result.data
	} catch (error) {
		console.error('Get my bid error:', error)
		return null
	}
}
