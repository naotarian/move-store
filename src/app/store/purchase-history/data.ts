import apiClient from '@/lib/api-client'

// 購入履歴データの型定義
export interface PurchaseHistoryItem {
	id: string
	estimate_id: string
	payment_id: string
	estimate_info: {
		id: string
	}
	payment_info: {
		id: string
		amount: number
		payment_date: string
		provider: string
		provider_id: string
	}
	purchased_at: string
	receipt_available: boolean
}

// ページネーション情報の型定義
export interface PaginationInfo {
	current_page: number
	last_page: number
	per_page: number
	total: number
	from: number | null
	to: number | null
}

// 購入履歴レスポンスの型定義
export interface PurchaseHistoryResponse {
	success: boolean
	data: PurchaseHistoryItem[]
	pagination: PaginationInfo
	filters: {
		start_date: string | null
		end_date: string | null
	}
}

// 購入履歴検索パラメータの型定義
export interface PurchaseHistorySearchParams {
	start_date?: string
	end_date?: string
	page?: number
	per_page?: number
}

/**
 * 購入履歴一覧を取得
 */
export async function getPurchaseHistory(
	params: PurchaseHistorySearchParams = {}
): Promise<PurchaseHistoryResponse> {
	try {
		const searchParams = new URLSearchParams()

		if (params.start_date) {
			searchParams.append('start_date', params.start_date)
		}
		if (params.end_date) {
			searchParams.append('end_date', params.end_date)
		}
		if (params.page) {
			searchParams.append('page', params.page.toString())
		}
		if (params.per_page) {
			searchParams.append('per_page', params.per_page.toString())
		}

		const queryString = searchParams.toString()
		const url = `/api/store/purchase-history${
			queryString ? `?${queryString}` : ''
		}`

		const result = await apiClient.getJson<PurchaseHistoryResponse>(url)
		return result
	} catch (error) {
		console.error('Get purchase history error:', error)
		throw error
	}
}

/**
 * 領収書ダウンロードURL（将来実装予定）
 */
export function getReceiptDownloadUrl(paymentId: string): string {
	return `/api/store/receipts/${paymentId}/download`
}

/**
 * 一括領収書ダウンロードURL（将来実装予定）
 */
export function getBulkReceiptDownloadUrl(paymentIds: string[]): string {
	const ids = paymentIds.join(',')
	return `/api/store/receipts/bulk-download?payment_ids=${ids}`
}
