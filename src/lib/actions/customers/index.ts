import { getCurrentStoreId } from '@/lib/auth'
import apiClient from '@/lib/api-client'
import { Estimate } from '@/types/estimate'

export interface Customer {
	id: string
	estimate_id: string
	store_id: string
	bid_id: string
	bid_amount_min: number
	bid_amount_max: number
	ranking: number
	is_notified: boolean
	granted_at: string
	estimate: Estimate
}

export interface AddressInfo {
	id: string
	estimate_id: string
	zipcode: string
	prefecture: string
	street_address: string
	building_details: string | null
	building_type: 'mansion' | 'apartment' | 'house' | 'other'
	room_layout: string | null
	floor: string | null
	elevator: 'yes' | 'no'
	latitude: number | null
	longitude: number | null
}

export interface CustomerListResponse {
	success: boolean
	data: Customer[]
	pagination: {
		current_page: number
		last_page: number
		per_page: number
		total: number
		from: number
		to: number
	}
}
export async function getCustomers(params?: {
	search?: string
	ranking?: string
	page?: number
	per_page?: number
}): Promise<CustomerListResponse> {
	const searchParams = new URLSearchParams()

	if (params?.search) {
		searchParams.append('search', params.search)
	}
	if (params?.ranking) {
		searchParams.append('ranking', params.ranking)
	}
	if (params?.page) {
		searchParams.append('page', params.page.toString())
	}
	if (params?.per_page) {
		searchParams.append('per_page', params.per_page.toString())
	}

	const queryString = searchParams.toString()
	const url = queryString
		? `/api/store/customers?${queryString}`
		: '/api/store/customers'

	const response = await apiClient.get(url)
	const result = await response.json()
	return result
}

export async function getCustomer(id: string): Promise<Customer> {
	const storeId = await getCurrentStoreId()
	const response = await apiClient.get(`/customers/${id}?store_id=${storeId}`)
	const result = await response.json()
	return result.data
}
