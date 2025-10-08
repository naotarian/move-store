'use server'
import apiClient from '@/lib/api-client'
export type BidRightState =
	| { ok: undefined } // 初期
	| { ok: true } // 成功
	| { ok: false; message: string } // 失敗

export async function getBidRightAction(
	_prev: BidRightState,
	formData: FormData
): Promise<BidRightState> {
	console.log('action')
	const estimateId = String(formData.get('estimateId') ?? '')

	try {
		if (!estimateId) {
			return { ok: false, message: '見積もりIDが不正です。' }
		}

		console.log('estimateId', estimateId)

		// TODO: 実際のAPI呼び出しに置き換え
		const { data: response, status } = await apiClient.postJsonWithStatus(
			'/api/store/estimate-bid-rights',
			{
				estimate_id: estimateId,
			}
		)

		console.log('response', response, 'status', status)

		// 成功の場合
		if (status >= 200 && status < 300) {
			return { ok: true }
		}

		// エラーの場合（ここには来ないはずだが、念のため）
		return {
			ok: false,
			message: '入札権の取得に失敗しました。時間をおいて再度お試しください。',
		}
	} catch (e: unknown) {
		console.error('getBidRightAction error:', e)

		// ステータスコードに基づくエラーハンドリング
		const error = e as { status?: number }
		const status = error.status || 500
		console.log('Error status:', status)

		if (status === 409) {
			return { ok: false, message: '既に入札権を取得済みです。' }
		}

		if (status === 429) {
			return {
				ok: false,
				message:
					'入札権の取得上限数を超えました。しばらく時間をおいてから再度お試しください。',
			}
		}

		// その他のエラー
		return {
			ok: false,
			message: '入札権の取得に失敗しました。時間をおいて再度お試しください。',
		}
	}
}
