'use client'

import { useEffect, useState } from 'react'

interface GoogleMapsLoaderProps {
	children: React.ReactNode
}

export function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
	const [isLoaded, setIsLoaded] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// 既に読み込まれている場合
		if (window.google && window.google.maps) {
			setIsLoaded(true)
			return
		}

		// スクリプトが既に存在するかチェック
		const existingScript = document.getElementById('google-maps-script')
		if (existingScript) {
			// 既存のスクリプトの読み込み完了を待つ
			const checkLoaded = () => {
				if (window.google && window.google.maps) {
					setIsLoaded(true)
				} else {
					setTimeout(checkLoaded, 100)
				}
			}
			checkLoaded()
			return
		}

		// 読み込み中フラグをチェック
		if ((window as any).googleMapsLoading) {
			const checkLoaded = () => {
				if (window.google && window.google.maps) {
					setIsLoaded(true)
				} else {
					setTimeout(checkLoaded, 100)
				}
			}
			checkLoaded()
			return
		}

		// サーバーサイドからAPIキーを安全に取得
		const loadMapsAPI = async () => {
			try {
				// 読み込み開始フラグを設定
				;(window as any).googleMapsLoading = true

				const response = await fetch('/api/maps/config')
				const data = await response.json()

				if (!response.ok || !data.success) {
					setError(data.error || 'Failed to get API configuration')
					;(window as any).googleMapsLoading = false
					return
				}

				const apiKey = data.apiKey

				// Google Maps APIスクリプトを動的に読み込み
				const script = document.createElement('script')
				script.id = 'google-maps-script'
				script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
				script.async = true
				script.defer = true

				script.onload = () => {
					;(window as any).googleMapsLoading = false
					setIsLoaded(true)
				}

				script.onerror = () => {
					;(window as any).googleMapsLoading = false
					setError('Failed to load Google Maps API')
				}

				document.head.appendChild(script)
			} catch (err) {
				console.error('Error loading Maps API:', err)
				;(window as any).googleMapsLoading = false
				setError('Failed to load maps configuration')
			}
		}

		loadMapsAPI()

		// クリーンアップ
		return () => {
			const scriptElement = document.getElementById('google-maps-script')
			if (scriptElement) {
				document.head.removeChild(scriptElement)
			}
		}
	}, [])

	if (error) {
		return (
			<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
				<p className='text-red-800 font-medium'>マップの読み込みエラー</p>
				<p className='text-red-600 text-sm mt-1'>{error}</p>
			</div>
		)
	}

	if (!isLoaded) {
		return (
			<div className='bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
				<p className='text-gray-600'>マップを読み込んでいます...</p>
			</div>
		)
	}

	return <>{children}</>
}
