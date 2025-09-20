'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, RotateCcw } from 'lucide-react'
import { DateRangePicker } from './DateRangePicker'
import { PurchaseHistorySearchParams } from '@/app/store/purchase-history/data'

interface PurchaseHistoryFiltersProps {
	currentFilters: PurchaseHistorySearchParams
}

const PurchaseHistoryFilters: React.FC<PurchaseHistoryFiltersProps> = ({
	currentFilters,
}) => {
	const router = useRouter()
	const [startDate, setStartDate] = useState(currentFilters.start_date || '')
	const [endDate, setEndDate] = useState(currentFilters.end_date || '')

	// 検索実行
	const handleSearch = () => {
		const params = new URLSearchParams()

		if (startDate) {
			params.append('start_date', startDate)
		}
		if (endDate) {
			params.append('end_date', endDate)
		}
		// ページは1にリセット
		params.append('page', '1')

		if (currentFilters.per_page) {
			params.append('per_page', currentFilters.per_page.toString())
		}

		router.push(`/store/purchase-history?${params.toString()}`)
	}

	// フィルターリセット
	const handleReset = () => {
		setStartDate('')
		setEndDate('')
		router.push('/store/purchase-history')
	}

	// プリセット期間の設定
	const setPresetPeriod = (months: number) => {
		const end = new Date()
		const start = new Date()
		start.setMonth(start.getMonth() - months)

		const endDateStr = end.toISOString().split('T')[0]
		const startDateStr = start.toISOString().split('T')[0]

		setStartDate(startDateStr)
		setEndDate(endDateStr)
	}

	return (
		<div className='space-y-4'>
			{/* Date Range Picker */}
			<DateRangePicker
				startDate={startDate}
				endDate={endDate}
				onStartDateChange={setStartDate}
				onEndDateChange={setEndDate}
			/>

			{/* プリセット期間ボタン */}
			<div className='flex flex-wrap gap-2'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => setPresetPeriod(1)}
				>
					直近1ヶ月
				</Button>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => setPresetPeriod(3)}
				>
					直近3ヶ月
				</Button>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => setPresetPeriod(6)}
				>
					直近6ヶ月
				</Button>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => setPresetPeriod(12)}
				>
					直近1年
				</Button>
			</div>

			{/* アクションボタン */}
			<div className='flex gap-3 pt-2'>
				<Button
					type='button'
					onClick={handleSearch}
					className='flex items-center gap-2'
				>
					<Search className='h-4 w-4' />
					検索
				</Button>
				<Button
					type='button'
					variant='outline'
					onClick={handleReset}
					className='flex items-center gap-2'
				>
					<RotateCcw className='h-4 w-4' />
					リセット
				</Button>
			</div>
		</div>
	)
}

export default PurchaseHistoryFilters
