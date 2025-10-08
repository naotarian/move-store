import React from 'react'
import { FileText } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import { getEstimatesList, EstimateFilters } from '@/lib/actions/estimates'
import { getRegions, RegionsResponse } from '@/lib/actions/regions'
import { EstimatesTable } from '@/components/EstimatesTable'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { EstimateFilters as EstimateFiltersComponent } from '@/components/estimates/EstimateFilters'
import { EstimatesListResponse } from '@/lib/actions/estimates'
import { requireAuth } from '@/lib/auth'
interface EstimatesPageProps {
	searchParams: Promise<{
		page?: string
		to_prefecture_code?: string
		from_prefecture_code?: string
	}>
}
export default async function EstimatesPage({
	searchParams,
}: EstimatesPageProps) {
	await requireAuth()
	const resolvedSearchParams = await searchParams
	const currentPage = parseInt(resolvedSearchParams.page || '1', 10)

	// フィルタ条件を構築
	const filters: EstimateFilters = {}

	// ハイフン区切りの文字列を数値配列に変換するヘルパー関数
	const parseHyphenSeparatedNumbers = (value: string | undefined): number[] => {
		if (!value || typeof value !== 'string') return []
		return value
			.split('-')
			.map(Number)
			.filter((n) => !isNaN(n))
	}

	filters.to_prefecture_codes = parseHyphenSeparatedNumbers(
		resolvedSearchParams.to_prefecture_code
	)
	filters.from_prefecture_codes = parseHyphenSeparatedNumbers(
		resolvedSearchParams.from_prefecture_code
	)

	try {
		// 地域データと見積もりデータを並行取得
		const [regionsData, estimatesData]: [
			RegionsResponse,
			EstimatesListResponse
		] = await Promise.all([
			getRegions(),
			getEstimatesList(currentPage, 20, filters),
		])

		return (
			<AuthLayout>
				<div className='min-h-screen bg-gray-50'>
					<SubHeader title='見積もり一覧' />
					<Navigation />

					{/* メインコンテンツ */}
					<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
						<div className='px-4 py-6 sm:px-0'>
							{/* サイドバー + メインコンテンツレイアウト（デスクトップ） / 縦並び（モバイル） */}
							<div className='flex flex-col lg:flex-row gap-6'>
								{/* サイドバー: フィルタ */}
								<aside className='lg:w-80 lg:flex-shrink-0'>
									{regionsData.success && (
										<EstimateFiltersComponent regions={regionsData.data} />
									)}
								</aside>

								{/* メインコンテンツ: 見積もり一覧 */}
								<div className='flex-1'>
									{estimatesData.success && estimatesData.data.length > 0 ? (
										<>
											<EstimatesTable estimates={estimatesData.data} />
											<Pagination
												currentPage={estimatesData.pagination.current_page}
												lastPage={estimatesData.pagination.last_page}
												total={estimatesData.pagination.total}
												from={estimatesData.pagination.from}
												to={estimatesData.pagination.to}
												baseUrl='/store/estimates'
											/>
										</>
									) : (
										<EmptyState
											icon={FileText}
											title='見積もりがありません'
											description='条件に一致する見積もり依頼がありません。'
										/>
									)}
								</div>
							</div>
						</div>
					</main>
				</div>
			</AuthLayout>
		)
	} catch (error) {
		console.error('Server Action error:', error)
		// エラーは自動的にerror.tsxで処理される
		throw error
	}
}
