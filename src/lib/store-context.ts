import { getCurrentStore, getCurrentStoreId } from '@/lib/auth'

/**
 * 現在ログイン中のstore情報を取得
 * Server Component内で使用
 */
export async function getStoreContext() {
	const store = await getCurrentStore()
	return {
		id: store.id,
		name: store.name,
		email: store.email,
	}
}

/**
 * 現在ログイン中のstoreIDのみを取得
 * Server Component内で使用
 */
export async function getStoreId(): Promise<string> {
	return await getCurrentStoreId()
}

/**
 * store情報をpropsとして渡すためのヘルパー
 */
export interface StoreContextProps {
	storeId: string
	storeName: string
	storeEmail: string
}

export async function withStoreContext(): Promise<StoreContextProps> {
	const store = await getCurrentStore()
	return {
		storeId: store.id,
		storeName: store.name,
		storeEmail: store.email,
	}
}
