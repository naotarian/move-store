'use server'

import { cookies } from 'next/headers'

export async function getBidRanking() {
	const cookieStore = await cookies()
	const token = cookieStore.get('store_token')?.value

	if (!token) {
		throw new Error('認証トークンが見つかりません。ログインしてください。')
	}

	const response = await fetch(`${process.env.API_BASE_URL}/api/bid-ranking`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})

	const result = await response.json()

	return result
}
