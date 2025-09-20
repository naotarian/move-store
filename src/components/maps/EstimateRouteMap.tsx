'use client'

import { useEffect, useRef } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface EstimateRouteMapProps {
	fromAddress: {
		zipcode?: string
		prefecture?: string
		street_address?: string
		building_details?: string | null
		latitude?: number | null
		longitude?: number | null
	}
	toAddress: {
		zipcode?: string
		prefecture?: string
		street_address?: string
		building_details?: string | null
		latitude?: number | null
		longitude?: number | null
	}
	straightDistance?: number | null
	className?: string
}

declare global {
	interface Window {
		google: any
		initMap: () => void
	}
}

export function EstimateRouteMap({
	fromAddress,
	toAddress,
	straightDistance,
	className = '',
}: EstimateRouteMapProps) {
	const mapRef = useRef<HTMLDivElement>(null)
	const mapInstanceRef = useRef<any>(null)

	// 住所文字列を生成
	const formatAddress = (address: typeof fromAddress) => {
		const parts = []
		if (address.zipcode) parts.push(address.zipcode)
		if (address.prefecture) parts.push(address.prefecture)
		if (address.street_address) parts.push(address.street_address)
		if (address.building_details) parts.push(address.building_details)
		return parts.join(' ')
	}

	const fromAddressText = formatAddress(fromAddress)
	const toAddressText = formatAddress(toAddress)

	useEffect(() => {
		// Google Maps APIが読み込まれているかチェック
		if (!window.google) {
			console.warn('Google Maps API is not loaded')
			return
		}

		// 両方の座標が存在するかチェック
		if (
			!fromAddress.latitude ||
			!fromAddress.longitude ||
			!toAddress.latitude ||
			!toAddress.longitude
		) {
			console.warn('Coordinates are missing for map display')
			return
		}

		// 座標が有効な数値かチェック
		const fromLat = parseFloat(String(fromAddress.latitude))
		const fromLng = parseFloat(String(fromAddress.longitude))
		const toLat = parseFloat(String(toAddress.latitude))
		const toLng = parseFloat(String(toAddress.longitude))

		if (isNaN(fromLat) || isNaN(fromLng) || isNaN(toLat) || isNaN(toLng)) {
			console.warn('Invalid coordinate values:', {
				fromAddress: { lat: fromAddress.latitude, lng: fromAddress.longitude },
				toAddress: { lat: toAddress.latitude, lng: toAddress.longitude },
			})
			return
		}

		initializeMap()
	}, [fromAddress, toAddress])

	const initializeMap = () => {
		if (!mapRef.current || !window.google) return

		// 緯度・経度を確実に数値に変換
		const fromCoords = {
			lat: parseFloat(String(fromAddress.latitude!)),
			lng: parseFloat(String(fromAddress.longitude!)),
		}

		const toCoords = {
			lat: parseFloat(String(toAddress.latitude!)),
			lng: parseFloat(String(toAddress.longitude!)),
		}

		// 数値変換が失敗した場合のチェック
		if (
			isNaN(fromCoords.lat) ||
			isNaN(fromCoords.lng) ||
			isNaN(toCoords.lat) ||
			isNaN(toCoords.lng)
		) {
			console.error('Invalid coordinates:', { fromCoords, toCoords })
			return
		}

		// マップの中心点を計算
		const centerLat = (fromCoords.lat + toCoords.lat) / 2
		const centerLng = (fromCoords.lng + toCoords.lng) / 2

		// マップを初期化
		const map = new window.google.maps.Map(mapRef.current, {
			center: { lat: centerLat, lng: centerLng },
			zoom: 10,
			mapTypeId: window.google.maps.MapTypeId.ROADMAP,
			styles: [
				{
					featureType: 'poi',
					elementType: 'labels',
					stylers: [{ visibility: 'off' }],
				},
			],
		})

		mapInstanceRef.current = map

		// 引越し元マーカー
		const fromMarker = new window.google.maps.Marker({
			position: fromCoords,
			map: map,
			title: '引越し元',
			icon: {
				url:
					'data:image/svg+xml;charset=UTF-8,' +
					encodeURIComponent(`
					<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
						<circle cx="16" cy="16" r="12" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
						<text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">出</text>
					</svg>
				`),
				scaledSize: new window.google.maps.Size(32, 32),
				anchor: new window.google.maps.Point(16, 16),
			},
		})

		// 引越し先マーカー
		const toMarker = new window.google.maps.Marker({
			position: toCoords,
			map: map,
			title: '引越し先',
			icon: {
				url:
					'data:image/svg+xml;charset=UTF-8,' +
					encodeURIComponent(`
					<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
						<circle cx="16" cy="16" r="12" fill="#22c55e" stroke="#ffffff" stroke-width="2"/>
						<text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">着</text>
					</svg>
				`),
				scaledSize: new window.google.maps.Size(32, 32),
				anchor: new window.google.maps.Point(16, 16),
			},
		})

		// 直線で結ぶ
		const directPath = new window.google.maps.Polyline({
			path: [fromCoords, toCoords],
			geodesic: true,
			strokeColor: '#3b82f6',
			strokeOpacity: 0.8,
			strokeWeight: 3,
			icons: [
				{
					icon: {
						path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
						scale: 4,
						strokeColor: '#3b82f6',
						fillColor: '#3b82f6',
						fillOpacity: 1,
					},
					offset: '50%',
				},
			],
		})

		directPath.setMap(map)

		// マーカーの情報ウィンドウ
		const fromInfoWindow = new window.google.maps.InfoWindow({
			content: `
				<div class="p-2">
					<h3 class="font-semibold text-sm mb-1">引越し元</h3>
					<p class="text-xs text-gray-600">${fromAddressText}</p>
				</div>
			`,
		})

		const toInfoWindow = new window.google.maps.InfoWindow({
			content: `
				<div class="p-2">
					<h3 class="font-semibold text-sm mb-1">引越し先</h3>
					<p class="text-xs text-gray-600">${toAddressText}</p>
				</div>
			`,
		})

		fromMarker.addListener('click', () => {
			toInfoWindow.close()
			fromInfoWindow.open(map, fromMarker)
		})

		toMarker.addListener('click', () => {
			fromInfoWindow.close()
			toInfoWindow.open(map, toMarker)
		})

		// マップの境界を調整
		const bounds = new window.google.maps.LatLngBounds()
		bounds.extend(fromCoords)
		bounds.extend(toCoords)
		map.fitBounds(bounds)

		// 最小ズームレベルを設定
		const listener = window.google.maps.event.addListener(map, 'idle', () => {
			if (map.getZoom() > 15) map.setZoom(15)
			window.google.maps.event.removeListener(listener)
		})
	}
	console.log(fromAddress, toAddress)
	// 座標が存在しない、または無効な場合の表示
	const fromLat = fromAddress.latitude
		? parseFloat(String(fromAddress.latitude))
		: null
	const fromLng = fromAddress.longitude
		? parseFloat(String(fromAddress.longitude))
		: null
	const toLat = toAddress.latitude
		? parseFloat(String(toAddress.latitude))
		: null
	const toLng = toAddress.longitude
		? parseFloat(String(toAddress.longitude))
		: null

	if (
		!fromLat ||
		!fromLng ||
		!toLat ||
		!toLng ||
		isNaN(fromLat) ||
		isNaN(fromLng) ||
		isNaN(toLat) ||
		isNaN(toLng)
	) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<span>引越し経路</span>
						{straightDistance && (
							<Badge variant='secondary'>直線距離: {straightDistance}km</Badge>
						)}
					</CardTitle>
					<CardDescription>
						引越し元から引越し先までの経路を表示します
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='bg-gray-50 rounded-lg p-8 text-center'>
						<p className='text-gray-500'>
							位置情報が取得できていないため、マップを表示できません
						</p>
						<div className='mt-4 text-sm text-gray-400'>
							<p>引越し元: {fromAddressText}</p>
							<p>引越し先: {toAddressText}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<span>引越し経路</span>
					{straightDistance && (
						<Badge variant='secondary'>直線距離: {straightDistance}km</Badge>
					)}
				</CardTitle>
				<CardDescription>
					引越し元から引越し先までの経路を表示します
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{/* 住所情報 */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
						<div className='flex items-start gap-2'>
							<div className='w-4 h-4 bg-red-500 rounded-full flex-shrink-0 mt-0.5'></div>
							<div>
								<p className='font-medium text-red-700'>引越し元</p>
								<p className='text-gray-600'>{fromAddressText}</p>
							</div>
						</div>
						<div className='flex items-start gap-2'>
							<div className='w-4 h-4 bg-green-500 rounded-full flex-shrink-0 mt-0.5'></div>
							<div>
								<p className='font-medium text-green-700'>引越し先</p>
								<p className='text-gray-600'>{toAddressText}</p>
							</div>
						</div>
					</div>

					{/* マップ */}
					<div
						ref={mapRef}
						className='w-full h-96 rounded-lg border border-gray-200'
						style={{ minHeight: '384px' }}
					/>

					<p className='text-xs text-gray-500 text-center'>
						※
						表示されている経路は直線距離です。実際の移動距離とは異なる場合があります。
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
