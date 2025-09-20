import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface StoreInfo {
	id: string
	name: string
	email: string
}

interface VerifyTokenResponse {
	success: boolean
	store?: StoreInfo
}

export async function verifyToken(token: string): Promise<VerifyTokenResponse> {
	try {
		const response = await fetch(
			`${process.env.API_BASE_URL}/api/store/verify`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
		const data = await response.json()

		if (data.success && data.store) {
			return {
				success: true,
				store: {
					id: data.store.id,
					name: data.store.name,
					email: data.store.email,
				},
			}
		}

		return { success: false }
	} catch (error) {
		return { success: false }
	}
}

export async function requireAuth(): Promise<string> {
	const cookieStore = await cookies()
	const token = cookieStore.get('store_token')?.value

	if (!token) {
		redirect('/login')
	}

	const verifyResult = await verifyToken(token)

	if (!verifyResult.success) {
		redirect('/login')
	}

	return token
}

export async function getCurrentStore(): Promise<StoreInfo> {
	const cookieStore = await cookies()
	const token = cookieStore.get('store_token')?.value

	if (!token) {
		redirect('/login')
	}

	const verifyResult = await verifyToken(token)

	if (!verifyResult.success || !verifyResult.store) {
		redirect('/login')
	}

	return verifyResult.store!
}

export async function getCurrentStoreId(): Promise<string> {
	const store = await getCurrentStore()
	return store.id
}
