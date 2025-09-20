import React from 'react'
import { FileText } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import { getEstimatesList } from '@/lib/actions/estimates'
import { EstimatesTable } from '@/components/EstimatesTable'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { EstimatesResponse } from '@/types/estimate'
import { requireAuth } from '@/lib/auth'
interface EstimatesPageProps {
	searchParams: Promise<{
		page?: string
	}>
}
export default async function EstimatesPage({
	searchParams,
}: EstimatesPageProps) {
	await requireAuth()
	const resolvedSearchParams = await searchParams
	const currentPage = parseInt(resolvedSearchParams.page || '1', 10)

	try {
		const estimatesData: EstimatesResponse = await getEstimatesList(
			currentPage,
			20
		)

		return (
			<AuthLayout>
				<div className='min-h-screen bg-gray-50'>
					<SubHeader title='見積もり一覧' />
					<Navigation />

					{/* メインコンテンツ */}
					<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
						<div className='px-4 py-6 sm:px-0'>
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
									description='まだ見積もり依頼がありません。'
								/>
							)}
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
