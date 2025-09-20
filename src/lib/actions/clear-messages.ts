'use server'

import { cookies } from 'next/headers'

export async function clearMessages() {
	const cookieStore = await cookies()

	// メッセージクッキーを削除
	cookieStore.delete('bid_success_message')
	cookieStore.delete('bid_error_message')
}
