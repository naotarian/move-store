'use server'

import { cookies } from 'next/headers'

export interface Prefecture {
	id: string
	code: number
	name: string
}

export interface Region {
	id: string
	code: number
	name: string
	prefectures: Prefecture[]
}

export interface RegionsResponse {
	success: boolean
	data: Region[]
}

export async function getRegions(): Promise<RegionsResponse> {
	const cookieStore = await cookies()
	const token = cookieStore.get('store_token')?.value

	if (!token) {
		throw new Error('認証トークンが見つかりません。ログインしてください。')
	}

	const response = await fetch(
		`${process.env.API_BASE_URL}/api/store/regions`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			cache: 'force-cache', // 地域データは静的なのでキャッシュ
		}
	)

	if (!response.ok) {
		throw new Error(`APIエラー: ${response.status} ${response.statusText}`)
	}

	const result = await response.json()

	if (!result.success) {
		throw new Error(result.message || '地域データの取得に失敗しました')
	}

	return result
}
