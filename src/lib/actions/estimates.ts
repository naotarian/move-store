'use server'

import { cookies } from 'next/headers'

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

export async function getEstimatesList(
	page: number = 1,
	perPage: number = 20
): Promise<EstimatesListResponse> {
	const cookieStore = await cookies()
	const token = cookieStore.get('store_token')?.value

	if (!token) {
		throw new Error('認証トークンが見つかりません。ログインしてください。')
	}

	const response = await fetch(
		`${process.env.API_BASE_URL}/api/estimate?page=${page}&per_page=${perPage}`,
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

export interface EstimateDetailData {
	id: string
	name: string
	name_furigana: string
	phone: string
	email: string
	moving_from: {
		zipcode: string
		prefecture: string
		city: string
		street_address: string
		building_details: string
		building_type: string
		room_layout: string
		floor: string
		elevator: string
		latitude: number
		longitude: number
		floor_plan: string
		floor_number: string
		has_elevator: boolean
	}
	moving_to: {
		zipcode: string
		prefecture: string
		city: string
		street_address: string
		building_details: string
		building_type: string
		room_layout: string
		floor: string
		elevator: string
		latitude: number
		longitude: number
		floor_plan: string
		floor_number: string
		has_elevator: boolean
	}
	moving_date_type: string
	moving_date: string
	moving_specific_date?: string
	moving_year_month?: string
	moving_period?: string
	people_count: number
	work_start_time_type: string
	work_start_time?: string
	other_luggage?: string
	luggage_items: Array<{
		id: string
		quantity: number
		luggage: {
			id: string
			name: string
			sub_label?: string
			category: {
				id: string
				name: string
			}
		}
	}>
	status: string
	straight_distance_km: number | null
	created_at: string
	updated_at: string
}

export interface EstimateDetailResponse {
	success: boolean
	data: EstimateDetailData
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
