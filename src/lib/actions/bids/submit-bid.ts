'use server'

import { getCurrentStoreId } from '@/lib/auth'
import apiClient from '@/lib/api-client'

interface BidData {
	estimateId: string
	storeId: string
	minPrice: number
	maxPrice: number
	message?: string
}

export async function submitBid(formData: FormData) {
	const { revalidatePath } = await import('next/cache')
	const { redirect } = await import('next/navigation')

	let estimateId: string = ''

	try {
		// ログイン中のstoreIDを取得
		const storeId = await getCurrentStoreId()

		// フォームデータから値を取得
		estimateId = formData.get('estimateId') as string
		const minPrice = Number(formData.get('minPrice'))
		const maxPrice = Number(formData.get('maxPrice'))
		const message = formData.get('message') as string

		if (!estimateId) {
			console.error('Validation Error: 見積もりIDが必要です')
			throw new Error('見積もりIDが必要です')
		}

		if (!minPrice || minPrice <= 0) {
			console.error('Validation Error: 最低価格が無効です', { minPrice })
			throw new Error('最低価格は1円以上で入力してください')
		}

		if (!maxPrice || maxPrice <= 0) {
			console.error('Validation Error: 最高価格が無効です', { maxPrice })
			throw new Error('最高価格は1円以上で入力してください')
		}

		if (minPrice > maxPrice) {
			console.error('Validation Error: 価格の関係が無効です', {
				minPrice,
				maxPrice,
			})
			throw new Error('最低価格は最高価格以下で入力してください')
		}

		// 入札データを構築
		const bidData: BidData = {
			estimateId,
			storeId,
			minPrice,
			maxPrice,
			message: message || undefined,
		}

		// API呼び出しを実行
		const result = await apiClient.postJson<{ data: any }>(
			`/api/store/estimates/${estimateId}/bids`,
			bidData
		)

		// 成功時の処理

		// データの再検証
		revalidatePath(`/store/estimates/${estimateId}/bid`)
	} catch (error) {
		// 詳細なエラーログを出力
		console.error('=== Submit Bid Error ===')
		console.error('Error Type:', error?.constructor?.name)
		console.error(
			'Error Message:',
			error instanceof Error ? error.message : String(error)
		)
		console.error(
			'Error Stack:',
			error instanceof Error ? error.stack : 'No stack trace'
		)

		// フォームデータの詳細をログ出力
		const formDataEntries = Array.from(formData.entries())
		console.error('Form Data:', Object.fromEntries(formDataEntries))

		// 環境情報をログ出力
		console.error('Environment:', {
			NODE_ENV: process.env.NODE_ENV,
			API_BASE_URL: process.env.API_BASE_URL,
			timestamp: new Date().toISOString(),
		})

		// APIクライアントのエラーの場合、詳細情報を抽出
		if (error instanceof Error) {
			if (error.message.includes('API request failed')) {
				console.error('API Error Details:', error.message)
			}
			if (error.message.includes('認証')) {
				console.error('Authentication Error - Token may be invalid or expired')
			}
			if (error.message.includes('404')) {
				console.error('Endpoint Not Found - Check API routes')
			}
		}

		console.error('========================')

		// エラーメッセージをcookieに設定してリダイレクト
		const { cookies } = await import('next/headers')
		const cookieStore = await cookies()
		const errorMessage =
			error instanceof Error ? error.message : '入札の送信に失敗しました'

		cookieStore.set('bid_error_message', errorMessage, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 10, // 10秒で期限切れ
		})

		if (estimateId) {
			redirect(`/store/estimates/${estimateId}/bid`)
		}

		// estimateIdが取得できない場合は一般的なエラーページへ
		redirect('/store/error')
	}

	// 成功メッセージをcookieに設定してリダイレクト
	const { cookies } = await import('next/headers')
	const cookieStore = await cookies()
	cookieStore.set('bid_success_message', '入札を送信しました。', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 5, // 5秒で期限切れ
	})

	redirect(`/store/estimates/${estimateId}/bid`)
}
