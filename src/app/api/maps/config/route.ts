import { NextResponse } from 'next/server'

export async function GET() {
	try {
		// サーバーサイドでAPIキーを安全に取得
		const apiKey = process.env.GOOGLE_MAPS_API_KEY

		if (!apiKey) {
			return NextResponse.json(
				{ error: 'Google Maps API key is not configured' },
				{ status: 500 }
			)
		}

		// APIキーをレスポンスで返す（HTTPS環境では安全）
		return NextResponse.json({
			apiKey: apiKey,
			success: true,
		})
	} catch (error) {
		console.error('Maps config API error:', error)
		return NextResponse.json(
			{ error: 'Failed to get maps configuration' },
			{ status: 500 }
		)
	}
}
