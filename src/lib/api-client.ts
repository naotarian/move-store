import { cookies } from 'next/headers'

/**
 * 認証情報付きAPIクライアント
 */
export class AuthenticatedApiClient {
	private baseUrl: string

	constructor() {
		this.baseUrl = process.env.API_BASE_URL!
	}

	/**
	 * 認証トークンを取得
	 */
	private async getAuthToken(): Promise<string> {
		const cookieStore = await cookies()
		const token = cookieStore.get('store_token')?.value

		if (!token) {
			throw new Error('認証トークンが見つかりません。ログインしてください。')
		}

		return token
	}

	/**
	 * 認証情報付きfetch
	 */
	private async authenticatedFetch(
		endpoint: string,
		options: RequestInit = {}
	): Promise<Response> {
		const token = await this.getAuthToken()

		const defaultHeaders = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		}

		const mergedOptions: RequestInit = {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers,
			},
		}

		const url = endpoint.startsWith('http')
			? endpoint
			: `${this.baseUrl}${endpoint}`

		// 開発環境でのみ詳細ログを出力
		if (process.env.NODE_ENV === 'development') {
			console.log(`API Request: ${mergedOptions.method || 'GET'} ${url}`)
		}

		const response = await fetch(url, mergedOptions)

		if (!response.ok) {
			// 入札権確認APIの403エラーはログに出力しない（正常な業務フロー）
			const isBidRightCheckApi = url.includes('/estimate-bid-rights/check')
			const shouldLogError = !(response.status === 403 && isBidRightCheckApi)

			if (shouldLogError) {
				console.error(
					`API Error: ${mergedOptions.method || 'GET'} ${url} - ${
						response.status
					} ${response.statusText}`
				)
			}

			// 401の場合は認証エラー
			if (response.status === 401) {
				throw new Error('認証が無効です。再ログインしてください。')
			}

			// 403の場合はレスポンスボディも含めてエラーを作成
			if (response.status === 403) {
				const errorData = await response.json().catch(() => ({}))
				const error = new Error(
					`403 Forbidden: アクセスが拒否されました`
				) as any
				error.status = 403
				error.response = { data: errorData }
				throw error
			}

			// 404の場合は詳細なエラー
			if (response.status === 404) {
				throw new Error(`404 Not Found: エンドポイントが見つかりません`)
			}

			// その他のエラー
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return response
	}

	/**
	 * GET リクエスト
	 */
	async get(endpoint: string, options?: RequestInit): Promise<Response> {
		return this.authenticatedFetch(endpoint, {
			...options,
			method: 'GET',
		})
	}

	/**
	 * POST リクエスト
	 */
	async post(
		endpoint: string,
		data?: any,
		options?: RequestInit
	): Promise<Response> {
		return this.authenticatedFetch(endpoint, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		})
	}

	/**
	 * PUT リクエスト
	 */
	async put(
		endpoint: string,
		data?: any,
		options?: RequestInit
	): Promise<Response> {
		return this.authenticatedFetch(endpoint, {
			...options,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		})
	}

	/**
	 * PATCH リクエスト
	 */
	async patch(
		endpoint: string,
		data?: any,
		options?: RequestInit
	): Promise<Response> {
		return this.authenticatedFetch(endpoint, {
			...options,
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined,
		})
	}

	/**
	 * DELETE リクエスト
	 */
	async delete(endpoint: string, options?: RequestInit): Promise<Response> {
		return this.authenticatedFetch(endpoint, {
			...options,
			method: 'DELETE',
		})
	}

	/**
	 * レスポンスをJSONとして取得
	 */
	async getJson<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
		const response = await this.get(endpoint, options)
		return response.json()
	}

	/**
	 * POSTリクエストでJSONレスポンスを取得
	 */
	async postJson<T = any>(
		endpoint: string,
		data?: any,
		options?: RequestInit
	): Promise<T> {
		const response = await this.post(endpoint, data, options)
		return response.json()
	}

	/**
	 * PUTリクエストでJSONレスポンスを取得
	 */
	async putJson<T = any>(
		endpoint: string,
		data?: any,
		options?: RequestInit
	): Promise<T> {
		const response = await this.put(endpoint, data, options)
		return response.json()
	}

	/**
	 * PATCHリクエストでJSONレスポンスを取得
	 */
	async patchJson<T = any>(
		endpoint: string,
		data?: any,
		options?: RequestInit
	): Promise<T> {
		const response = await this.patch(endpoint, data, options)
		return response.json()
	}
}

// シングルトンインスタンス
const apiClient = new AuthenticatedApiClient()

export default apiClient
