import React from 'react'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import PurchaseHistoryFilters from '@/components/purchase-history/PurchaseHistoryFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import {
	Receipt,
	History,
	Download,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react'
import { getPurchaseHistory, PurchaseHistorySearchParams } from './data'
import Link from 'next/link'

interface PurchaseHistoryPageProps {
	searchParams: Promise<{
		start_date?: string
		end_date?: string
		page?: string
		per_page?: string
	}>
}

// 日時フォーマット
function formatDateTime(dateString: string) {
	const date = new Date(dateString)
	return date.toLocaleString('ja-JP', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

// 金額フォーマット
function formatAmount(amount: number) {
	return new Intl.NumberFormat('ja-JP', {
		style: 'currency',
		currency: 'JPY',
	}).format(amount)
}

// ページネーションリンクを生成
function getPageLink(
	page: number,
	currentFilters: PurchaseHistorySearchParams
) {
	const params = new URLSearchParams()

	if (currentFilters.start_date) {
		params.append('start_date', currentFilters.start_date)
	}
	if (currentFilters.end_date) {
		params.append('end_date', currentFilters.end_date)
	}
	if (currentFilters.per_page) {
		params.append('per_page', currentFilters.per_page.toString())
	}
	params.append('page', page.toString())

	return `/store/purchase-history?${params.toString()}`
}

export default async function PurchaseHistoryPage({
	searchParams,
}: PurchaseHistoryPageProps) {
	const params = await searchParams

	// クエリパラメータを数値に変換
	const searchFilters = {
		start_date: params.start_date,
		end_date: params.end_date,
		page: params.page ? parseInt(params.page, 10) : 1,
		per_page: params.per_page ? parseInt(params.per_page, 10) : 20,
	}

	// 購入履歴データを取得
	const purchaseHistoryData = await getPurchaseHistory(searchFilters)

	return (
		<AuthLayout>
			<div className='min-h-screen bg-gray-50'>
				<SubHeader title='購入履歴' />
				<Navigation />

				<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
					<div className='px-4 py-6 sm:px-0'>
						{/* ページヘッダー */}
						<div className='mb-6'>
							<div className='flex items-center gap-3 mb-2'>
								<History className='h-6 w-6 text-blue-600' />
								<h1 className='text-2xl font-bold text-gray-900'>
									入札権購入履歴
								</h1>
							</div>
							<p className='text-gray-600 text-sm'>
								これまでに購入した入札権の履歴を確認できます。領収書のダウンロードも可能です。
							</p>
						</div>

						{/* 検索フィルター */}
						<Card className='mb-6'>
							<Accordion type='single' collapsible>
								<AccordionItem value='filters' className='border-none'>
									<AccordionTrigger className='px-6 py-4 hover:no-underline justify-start gap-2 items-center'>
										<CardTitle className='text-lg'>検索・絞り込み</CardTitle>
									</AccordionTrigger>
									<AccordionContent className='px-6 pb-6'>
										<PurchaseHistoryFilters currentFilters={searchFilters} />
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</Card>

						{/* 購入履歴一覧 */}
						{purchaseHistoryData.data.length === 0 ? (
							<Card>
								<CardContent className='p-8 text-center'>
									<Receipt className='h-12 w-12 text-gray-400 mx-auto mb-4' />
									<h3 className='text-lg font-medium text-gray-900 mb-2'>
										購入履歴がありません
									</h3>
									<p className='text-gray-600'>
										指定された期間内に入札権の購入履歴がありません。
									</p>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardHeader>
									<CardTitle className='flex items-center justify-between'>
										<span>購入履歴一覧</span>
										<div className='text-sm font-normal text-gray-500 text-right'>
											<div className='mb-1'>
												表示期間:{' '}
												{searchFilters.start_date && searchFilters.end_date
													? `${searchFilters.start_date} 〜 ${searchFilters.end_date}`
													: '直近3ヶ月'}
											</div>
											<div>
												{purchaseHistoryData.pagination.total}件中{' '}
												{purchaseHistoryData.pagination.from}-
												{purchaseHistoryData.pagination.to}件を表示
											</div>
										</div>
									</CardTitle>
								</CardHeader>
								<CardContent className='px-4'>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className='w-40'>購入日時</TableHead>
												<TableHead className='w-32'>見積もりID</TableHead>
												<TableHead className='w-24 text-right'>金額</TableHead>
												<TableHead className='w-28 text-center'>
													領収書
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{purchaseHistoryData.data.map((item) => (
												<TableRow key={item.id}>
													<TableCell>
														<div className='text-sm'>
															{formatDateTime(item.purchased_at)}
														</div>
													</TableCell>
													<TableCell>
														<Link
															href={`/store/estimates/${item.estimate_id}`}
															className='text-blue-600 hover:text-blue-800 hover:underline text-sm'
															title={item.estimate_id}
														>
															{item.estimate_id}
														</Link>
													</TableCell>
													<TableCell className='text-right'>
														<div className='font-medium'>
															{formatAmount(item.payment_info.amount)}
														</div>
													</TableCell>
													<TableCell className='text-center'>
														<div className='flex justify-center'>
															<Link
																href={`/api/store/receipts/${item.payment_id}/download`}
																target='_blank'
															>
																<Button
																	size='sm'
																	variant='outline'
																	className='flex items-center gap-1'
																	disabled={!item.receipt_available}
																>
																	<Download className='h-3 w-3' />
																	領収書
																</Button>
															</Link>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						)}

						{/* ページネーション */}
						{purchaseHistoryData.pagination.last_page > 1 && (
							<Card className='mt-4'>
								<CardContent className='p-4'>
									<div className='flex items-center justify-between'>
										<div className='text-sm text-gray-600'>
											{purchaseHistoryData.pagination.total}件中{' '}
											{purchaseHistoryData.pagination.from}-
											{purchaseHistoryData.pagination.to}件を表示
										</div>
										<div className='flex items-center gap-2'>
											{purchaseHistoryData.pagination.current_page > 1 ? (
												<Link
													href={getPageLink(
														purchaseHistoryData.pagination.current_page - 1,
														searchFilters
													)}
												>
													<Button variant='outline' size='sm'>
														<ChevronLeft className='h-4 w-4' />
														前へ
													</Button>
												</Link>
											) : (
												<Button variant='outline' size='sm' disabled>
													<ChevronLeft className='h-4 w-4' />
													前へ
												</Button>
											)}
											<span className='text-sm'>
												{purchaseHistoryData.pagination.current_page} /{' '}
												{purchaseHistoryData.pagination.last_page}
											</span>
											{purchaseHistoryData.pagination.current_page <
											purchaseHistoryData.pagination.last_page ? (
												<Link
													href={getPageLink(
														purchaseHistoryData.pagination.current_page + 1,
														searchFilters
													)}
												>
													<Button variant='outline' size='sm'>
														次へ
														<ChevronRight className='h-4 w-4' />
													</Button>
												</Link>
											) : (
												<Button variant='outline' size='sm' disabled>
													次へ
													<ChevronRight className='h-4 w-4' />
												</Button>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</main>
			</div>
		</AuthLayout>
	)
}
