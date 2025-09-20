export interface Estimate {
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

export interface EstimatesResponse {
	success: boolean
	data: Estimate[]
	pagination: {
		current_page: number
		last_page: number
		per_page: number
		total: number
		from: number
		to: number
	}
}

export interface StatusInfo {
	label: string
	color: string
}

// ステータス定数（バックエンドのEstimateモデルと一致）
export const ESTIMATE_STATUS = {
	DRAFT: 'draft', // 公開前
	PUBLISHED: 'published', // 公開中
	CLOSED: 'closed', // 公開終了
} as const

export type EstimateStatus =
	(typeof ESTIMATE_STATUS)[keyof typeof ESTIMATE_STATUS]
