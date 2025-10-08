'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Region } from '@/lib/actions/regions'

interface EstimateFiltersProps {
	regions: Region[]
}

export function EstimateFilters({ regions }: EstimateFiltersProps) {
	const router = useRouter()
	const searchParams = useSearchParams()

	// フィルタ状態（都道府県のみ）
	const [toPrefectureCodes, setToPrefectureCodes] = useState<number[]>([])
	const [fromPrefectureCodes, setFromPrefectureCodes] = useState<number[]>([])

	// ハイフン区切りの文字列を数値配列に変換するヘルパー関数
	const parseHyphenSeparatedNumbers = (value: string | null): number[] => {
		if (!value || typeof value !== 'string' || value.trim() === '') return []
		return value
			.split('-')
			.map((str) => parseInt(str.trim(), 10))
			.filter((n) => !isNaN(n) && n > 0)
	}

	// URLパラメータから初期状態を設定
	useEffect(() => {
		const toParam = searchParams.get('to_prefecture_code')
		const fromParam = searchParams.get('from_prefecture_code')

		const toPrefectures = parseHyphenSeparatedNumbers(toParam)
		const fromPrefectures = parseHyphenSeparatedNumbers(fromParam)

		setToPrefectureCodes(toPrefectures)
		setFromPrefectureCodes(fromPrefectures)
	}, [searchParams])

	// 地域ラベルクリック時のハンドラ（その地域の全都道府県を一括選択/解除）
	const handleRegionLabelClick = (regionCode: number, type: 'to' | 'from') => {
		const region = regions.find((r) => r.code === regionCode)
		if (!region) return

		const prefectureCodes = region.prefectures.map((p) => p.code)

		if (type === 'to') {
			// その地域の都道府県が全て選択されているかチェック
			const allSelected = prefectureCodes.every((code) =>
				toPrefectureCodes.includes(code)
			)

			if (allSelected) {
				// 全て選択されている場合は全て外す
				setToPrefectureCodes((prev) =>
					prev.filter((code) => !prefectureCodes.includes(code))
				)
			} else {
				// 一部または全て未選択の場合は全て選択
				setToPrefectureCodes((prev) => {
					const newCodes = [...prev]
					prefectureCodes.forEach((code) => {
						if (!newCodes.includes(code)) {
							newCodes.push(code)
						}
					})
					return newCodes
				})
			}
		} else {
			// その地域の都道府県が全て選択されているかチェック
			const allSelected = prefectureCodes.every((code) =>
				fromPrefectureCodes.includes(code)
			)

			if (allSelected) {
				// 全て選択されている場合は全て外す
				setFromPrefectureCodes((prev) =>
					prev.filter((code) => !prefectureCodes.includes(code))
				)
			} else {
				// 一部または全て未選択の場合は全て選択
				setFromPrefectureCodes((prev) => {
					const newCodes = [...prev]
					prefectureCodes.forEach((code) => {
						if (!newCodes.includes(code)) {
							newCodes.push(code)
						}
					})
					return newCodes
				})
			}
		}
	}

	// 都道府県選択時のハンドラ
	const handlePrefectureChange = (
		prefectureCode: number,
		checked: boolean,
		type: 'to' | 'from'
	) => {
		if (type === 'to') {
			if (checked) {
				setToPrefectureCodes((prev) => [...prev, prefectureCode])
			} else {
				setToPrefectureCodes((prev) =>
					prev.filter((code) => code !== prefectureCode)
				)
			}
		} else {
			if (checked) {
				setFromPrefectureCodes((prev) => [...prev, prefectureCode])
			} else {
				setFromPrefectureCodes((prev) =>
					prev.filter((code) => code !== prefectureCode)
				)
			}
		}
	}

	// 検索実行
	const handleSearch = () => {
		const params = new URLSearchParams()

		// ハイフン区切りで都道府県コードを送信
		if (toPrefectureCodes.length > 0) {
			params.append('to_prefecture_code', toPrefectureCodes.join('-'))
		}
		if (fromPrefectureCodes.length > 0) {
			params.append('from_prefecture_code', fromPrefectureCodes.join('-'))
		}

		// ページを1にリセット
		params.append('page', '1')

		router.push(`/store/estimates?${params.toString()}`)
	}

	// クリア
	const handleClear = () => {
		setToPrefectureCodes([])
		setFromPrefectureCodes([])
		router.push('/store/estimates')
	}

	// 選択中の項目数を計算
	const totalSelected = toPrefectureCodes.length + fromPrefectureCodes.length

	// 都道府県コードから都道府県名を取得するヘルパー関数
	const getPrefectureName = (code: number): string => {
		for (const region of regions) {
			const prefecture = region.prefectures.find((p) => p.code === code)
			if (prefecture) return prefecture.name
		}
		return `都道府県${code}`
	}

	// 個別の都道府県を削除する関数
	const removePrefecture = (prefectureCode: number, type: 'to' | 'from') => {
		if (type === 'to') {
			setToPrefectureCodes((prev) =>
				prev.filter((code) => code !== prefectureCode)
			)
		} else {
			setFromPrefectureCodes((prev) =>
				prev.filter((code) => code !== prefectureCode)
			)
		}
	}

	// 地域の選択状態を判定するヘルパー関数
	const getRegionSelectionState = (region: Region, type: 'to' | 'from') => {
		const prefectureCodes = region.prefectures.map((p) => p.code)
		const selectedCodes =
			type === 'to' ? toPrefectureCodes : fromPrefectureCodes

		const selectedCount = prefectureCodes.filter((code) =>
			selectedCodes.includes(code)
		).length

		if (selectedCount === 0) return 'none'
		if (selectedCount === prefectureCodes.length) return 'all'
		return 'partial'
	}

	return (
		<Card className='lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto mb-6'>
			<Accordion type='single' collapsible defaultValue='filters'>
				<AccordionItem value='filters' className='border-none'>
					<CardHeader className='pb-2'>
						<AccordionTrigger className='hover:no-underline p-0'>
							<div className='flex items-center justify-start gap-2'>
								<Search className='h-4 w-4' />
								<CardTitle className='text-base'>絞り込み検索</CardTitle>
								{totalSelected > 0 && (
									<span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
										{totalSelected}件
									</span>
								)}
							</div>
						</AccordionTrigger>
						<CardDescription className='text-left text-sm'>
							地域や都道府県で絞り込み
						</CardDescription>
					</CardHeader>
					<AccordionContent>
						<CardContent className='pt-4'>
							{/* 選択された都道府県をバッジ表示 */}
							{totalSelected > 0 && (
								<div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
									<h4 className='text-xs font-medium text-blue-900 mb-2'>
										選択中の都道府県
									</h4>
									<div className='space-y-2'>
										{/* 引っ越し元 */}
										{fromPrefectureCodes.length > 0 && (
											<div>
												<span className='text-xs text-blue-700 font-medium'>
													引っ越し元:{' '}
												</span>
												<div className='flex flex-wrap gap-1 mt-1 py-2'>
													{fromPrefectureCodes.map((code) => (
														<Badge
															key={`from-badge-${code}`}
															variant='secondary'
															className='text-xs bg-blue-100 text-blue-800 hover:bg-blue-200'
														>
															{getPrefectureName(code)}
															<X
																className='h-3 w-3 ml-1 cursor-pointer hover:text-blue-900'
																onClick={() => removePrefecture(code, 'from')}
															/>
														</Badge>
													))}
												</div>
											</div>
										)}

										{/* 引っ越し先 */}
										{toPrefectureCodes.length > 0 && (
											<div>
												<span className='text-xs text-green-700 font-medium'>
													引っ越し先:{' '}
												</span>
												<div className='flex flex-wrap gap-1 mt-1'>
													{toPrefectureCodes.map((code) => (
														<Badge
															key={`to-badge-${code}`}
															variant='secondary'
															className='text-xs bg-green-100 text-green-800 hover:bg-green-200'
														>
															{getPrefectureName(code)}
															<X
																className='h-3 w-3 ml-1 cursor-pointer hover:text-green-900'
																onClick={() => removePrefecture(code, 'to')}
															/>
														</Badge>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							)}

							<div className='space-y-6'>
								{/* 引っ越し元 */}
								<div className='space-y-2'>
									<h3 className='text-sm font-semibold text-gray-900'>
										引っ越し元
									</h3>
									<Accordion type='multiple' className='space-y-2 py-2'>
										{regions.map((region) => {
											const selectionState = getRegionSelectionState(
												region,
												'from'
											)
											return (
												<AccordionItem
													key={`from-${region.code}`}
													value={`from-${region.code}`}
													className='border rounded-lg last:border-b-1'
												>
													<AccordionTrigger className='px-3 py-2 hover:no-underline'>
														<div className='flex items-center justify-between w-full mr-2'>
															<Label
																className={`text-xs font-medium cursor-pointer flex items-center gap-2 ${
																	selectionState === 'all'
																		? 'text-blue-600'
																		: selectionState === 'partial'
																		? 'text-blue-400'
																		: 'text-gray-700'
																}`}
																onClick={(e) => {
																	e.stopPropagation()
																	handleRegionLabelClick(region.code, 'from')
																}}
															>
																{selectionState === 'all'
																	? '✓'
																	: selectionState === 'partial'
																	? '◐'
																	: '○'}
																{region.name}地方
																{selectionState === 'partial' && (
																	<span className='text-xs text-gray-500'>
																		(
																		{
																			region.prefectures.filter((p) =>
																				fromPrefectureCodes.includes(p.code)
																			).length
																		}
																		/{region.prefectures.length})
																	</span>
																)}
															</Label>
														</div>
													</AccordionTrigger>
													<AccordionContent className='px-3 pb-3'>
														<div className='ml-4 grid grid-cols-2 gap-1'>
															{region.prefectures.map((prefecture) => (
																<div
																	key={`from-${prefecture.code}`}
																	className='flex items-center space-x-2'
																>
																	<Checkbox
																		id={`from-prefecture-${prefecture.code}`}
																		checked={fromPrefectureCodes.includes(
																			prefecture.code
																		)}
																		onCheckedChange={(checked) =>
																			handlePrefectureChange(
																				prefecture.code,
																				checked as boolean,
																				'from'
																			)
																		}
																	/>
																	<Label
																		htmlFor={`from-prefecture-${prefecture.code}`}
																		className='text-xs cursor-pointer'
																	>
																		{prefecture.name}
																	</Label>
																</div>
															))}
														</div>
													</AccordionContent>
												</AccordionItem>
											)
										})}
									</Accordion>
								</div>

								{/* 引っ越し先 */}
								<div className='space-y-2'>
									<h3 className='text-sm font-semibold text-gray-900'>
										引っ越し先
									</h3>
									<Accordion type='multiple' className='space-y-2'>
										{regions.map((region) => {
											const selectionState = getRegionSelectionState(
												region,
												'to'
											)
											return (
												<AccordionItem
													key={`to-${region.code}`}
													value={`to-${region.code}`}
													className='border rounded-lg last:border-b-1'
												>
													<AccordionTrigger className='px-3 py-2 hover:no-underline'>
														<div className='flex items-center justify-between w-full mr-2'>
															<Label
																className={`text-xs font-medium cursor-pointer flex items-center gap-2 ${
																	selectionState === 'all'
																		? 'text-blue-600'
																		: selectionState === 'partial'
																		? 'text-blue-400'
																		: 'text-gray-700'
																}`}
																onClick={(e) => {
																	e.stopPropagation()
																	handleRegionLabelClick(region.code, 'to')
																}}
															>
																{selectionState === 'all'
																	? '✓'
																	: selectionState === 'partial'
																	? '◐'
																	: '○'}
																{region.name}地方
																{selectionState === 'partial' && (
																	<span className='text-xs text-gray-500'>
																		(
																		{
																			region.prefectures.filter((p) =>
																				toPrefectureCodes.includes(p.code)
																			).length
																		}
																		/{region.prefectures.length})
																	</span>
																)}
															</Label>
														</div>
													</AccordionTrigger>
													<AccordionContent className='px-3 pb-3'>
														<div className='ml-4 grid grid-cols-2 gap-1'>
															{region.prefectures.map((prefecture) => (
																<div
																	key={`to-${prefecture.code}`}
																	className='flex items-center space-x-2'
																>
																	<Checkbox
																		id={`to-prefecture-${prefecture.code}`}
																		checked={toPrefectureCodes.includes(
																			prefecture.code
																		)}
																		onCheckedChange={(checked) =>
																			handlePrefectureChange(
																				prefecture.code,
																				checked as boolean,
																				'to'
																			)
																		}
																	/>
																	<Label
																		htmlFor={`to-prefecture-${prefecture.code}`}
																		className='text-xs cursor-pointer'
																	>
																		{prefecture.name}
																	</Label>
																</div>
															))}
														</div>
													</AccordionContent>
												</AccordionItem>
											)
										})}
									</Accordion>
								</div>
							</div>

							{/* ボタン */}
							<div className='flex flex-col gap-2 mt-6'>
								<Button type='button' onClick={handleSearch} className='w-full'>
									<Search className='h-4 w-4 mr-1' />
									検索
								</Button>
								<Button
									type='button'
									variant='outline'
									onClick={handleClear}
									disabled={totalSelected === 0}
									className='w-full'
								>
									<X className='h-4 w-4 mr-1' />
									クリア
								</Button>
							</div>
						</CardContent>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</Card>
	)
}
