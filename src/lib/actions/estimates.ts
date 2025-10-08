'use server'

import { cookies } from 'next/headers'
import { Estimate } from '@/types/estimate'

export interface EstimateListItem {
	id: string
	customer_name: string
	customer_furigana: string
	customer_phone: string
	customer_email: string
	moving_from: {
		prefecture: string
		city: string
		street_address: string
		building_name: string | null
	}
	moving_to: {
		prefecture: string
		city: string
		street_address: string
		building_name: string | null
	}
	moving_date_type: string
	moving_date?: string
	moving_period?: string
	moving_year_month?: string
	people_count: number
	work_start_time_type: string
	work_start_time?: string
	other_luggage?: string
	has_bid_right: boolean
	has_bid: boolean
	bid_amount_min: number | null
	bid_amount_max: number | null
	status: string
	created_at: string
	updated_at: string
}

export interface EstimatesListResponse {
	success: boolean
	data: EstimateListItem[]
	pagination: {
		current_page: number
		last_page: number
		per_page: number
		total: number
		from: number
		to: number
	}
}

export interface EstimateFilters {
	to_prefecture_codes?: number[]
	from_prefecture_codes?: number[]
}

export async function getEstimatesList(
	page: number = 1,
	perPage: number = 20,
	filters?: EstimateFilters
): Promise<EstimatesListResponse> {
	const cookieStore = await cookies()
	const token = cookieStore.get('store_token')?.value

	if (!token) {
		throw new Error('認証トークンが見つかりません。ログインしてください。')
	}

	// クエリパラメータを構築
	const searchParams = new URLSearchParams()
	searchParams.append('page', page.toString())
	searchParams.append('per_page', perPage.toString())

	// フィルタ条件を追加（都道府県のみ、ハイフン区切りで送信）
	if (filters?.to_prefecture_codes?.length) {
		const validCodes = filters.to_prefecture_codes.filter(
			(code) => Number.isInteger(code) && code > 0
		)
		if (validCodes.length > 0) {
			searchParams.append('to_prefecture_code', validCodes.join('-'))
		}
	}
	if (filters?.from_prefecture_codes?.length) {
		const validCodes = filters.from_prefecture_codes.filter(
			(code) => Number.isInteger(code) && code > 0
		)
		if (validCodes.length > 0) {
			searchParams.append('from_prefecture_code', validCodes.join('-'))
		}
	}

	const response = await fetch(
		`${process.env.API_BASE_URL}/api/estimate?${searchParams.toString()}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)

	if (!response.ok) {
		throw new Error(`APIエラー: ${response.status} ${response.statusText}`)
	}

	const result = await response.json()

	if (!result.success) {
		throw new Error(result.message || '見積もり一覧の取得に失敗しました')
	}

	return result
}

export interface EstimateDetailResponse {
	success: boolean
	data: EstimateWithBidRanking
}
export interface EstimateWithBidRanking extends Estimate {
	bid_ranking_list: {
		is_tie: boolean
		max: number
		min: number
		rank: number
		store_id: string
		store_name: string
		tie_count: number
	}[]
}

export async function getEstimateDetail(
	id: string
): Promise<EstimateDetailResponse> {
	const cookieStore = await cookies()
	const token = cookieStore.get('store_token')?.value

	if (!token) {
		throw new Error('認証トークンが見つかりません。ログインしてください。')
	}

	const response = await fetch(
		`${process.env.API_BASE_URL}/api/estimate/${id}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)

	if (!response.ok) {
		throw new Error(`APIエラー: ${response.status} ${response.statusText}`)
	}

	const result = await response.json()

	if (!result.success) {
		throw new Error(result.message || '見積もり詳細の取得に失敗しました')
	}

	return result
}
