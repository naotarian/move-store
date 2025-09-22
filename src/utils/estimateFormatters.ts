import { StatusInfo, ESTIMATE_STATUS } from '@/types/estimate'
import { EstimateDetailData, EstimateListItem } from '@/lib/actions/estimates'

export const formatMovingDate = (estimate: EstimateListItem): string => {
	if (estimate.moving_date_type === 'decided' && estimate.moving_date) {
		// 日付をフォーマット（例：2025-09-16 → 2025年9月16日(火)）
		const date = new Date(estimate.moving_date)
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		const dayOfWeek = date.toLocaleDateString('ja-JP', { weekday: 'short' })

		return `${year}年${month}月${day}日(${dayOfWeek})`
	} else if (
		estimate.moving_date_type === 'undecided' &&
		estimate.moving_period &&
		estimate.moving_year_month
	) {
		const periodMap: { [key: string]: string } = {
			early: '上旬',
			middle: '中旬',
			late: '下旬',
		}

		// moving_year_monthから年月を取得（例：2025-09 → 2025年9月）
		const [year, month] = estimate.moving_year_month.split('-')
		const period = periodMap[estimate.moving_period] || estimate.moving_period

		return `${year}年${parseInt(month)}月${period}予定`
	}
	return '未定'
}

export const formatWorkStartTime = (
	estimate: EstimateListItem | EstimateDetailData
): string => {
	if (
		estimate.work_start_time_type === 'specific' &&
		estimate.work_start_time
	) {
		const timeMap: { [key: string]: string } = {
			morning: '午前中',
			afternoon: '12時~15時',
			evening: '15時以降',
		}
		return timeMap[estimate.work_start_time] || estimate.work_start_time
	}
	return 'いつでも'
}

export const formatPeopleCount = (count: number): string => {
	if (count === 4) {
		return '4人以上'
	}
	return `${count}人`
}

export const formatStatus = (status: string): StatusInfo => {
	const statusMap: { [key: string]: StatusInfo } = {
		[ESTIMATE_STATUS.DRAFT]: {
			label: '公開前',
			color: 'bg-gray-100 text-gray-800',
		},
		[ESTIMATE_STATUS.PUBLISHED]: {
			label: '公開中',
			color: 'bg-green-100 text-green-800',
		},
		[ESTIMATE_STATUS.CLOSED]: {
			label: '公開終了',
			color: 'bg-red-100 text-red-800',
		},
	}
	return (
		statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
	)
}
