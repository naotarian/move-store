'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'

interface DateRangePickerProps {
	startDate?: string
	endDate?: string
	onStartDateChange: (date: string) => void
	onEndDateChange: (date: string) => void
}

export function DateRangePicker({
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
}: DateRangePickerProps) {
	const [startDateOpen, setStartDateOpen] = React.useState(false)
	const [endDateOpen, setEndDateOpen] = React.useState(false)

	const startDateObj = startDate ? new Date(startDate) : undefined
	const endDateObj = endDate ? new Date(endDate) : undefined

	const handleStartDateSelect = (date: Date | undefined) => {
		if (date) {
			onStartDateChange(format(date, 'yyyy-MM-dd'))
			setStartDateOpen(false)
		}
	}

	const handleEndDateSelect = (date: Date | undefined) => {
		if (date) {
			onEndDateChange(format(date, 'yyyy-MM-dd'))
			setEndDateOpen(false)
		}
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
			{/* 開始日 */}
			<div className='space-y-2'>
				<Label className='flex items-center gap-2'>
					<CalendarIcon className='h-4 w-4' />
					開始日
				</Label>
				<Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							className={cn(
								'w-full justify-start text-left font-normal',
								!startDateObj && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{startDateObj
								? format(startDateObj, 'yyyy年MM月dd日')
								: '開始日を選択'}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0' align='start'>
						<Calendar
							mode='single'
							selected={startDateObj}
							onSelect={handleStartDateSelect}
							disabled={(date) =>
								date > new Date() || (endDateObj ? date > endDateObj : false)
							}
							captionLayout='dropdown'
						/>
					</PopoverContent>
				</Popover>
			</div>

			{/* 終了日 */}
			<div className='space-y-2'>
				<Label className='flex items-center gap-2'>
					<CalendarIcon className='h-4 w-4' />
					終了日
				</Label>
				<Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							className={cn(
								'w-full justify-start text-left font-normal',
								!endDateObj && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{endDateObj
								? format(endDateObj, 'yyyy年MM月dd日')
								: '終了日を選択'}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0' align='start'>
						<Calendar
							mode='single'
							selected={endDateObj}
							onSelect={handleEndDateSelect}
							disabled={(date) =>
								date > new Date() ||
								(startDateObj ? date < startDateObj : false)
							}
							captionLayout='dropdown'
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	)
}
