import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
import { requireAuth } from '@/lib/auth'
import { getCustomers } from '@/lib/actions/customers'
import AuthLayout from '@/components/AuthLayout'
import SubHeader from '@/components/common/SubHeader'
import Navigation from '@/components/common/Navigation'
import { CustomerDetailsDialog } from '@/components/customers/CustomerDetailsDialog'

const getRankingBadge = (ranking: number) => {
	const colors = {
		1: 'bg-yellow-500 text-white',
		2: 'bg-gray-400 text-white',
		3: 'bg-amber-600 text-white',
	}

	return (
		<Badge
			className={
				colors[ranking as keyof typeof colors] || 'bg-gray-500 text-white'
			}
		>
			<Trophy className='w-3 h-3 mr-1' />
			{ranking}位
		</Badge>
	)
}

interface PageProps {
	searchParams: Promise<{
		search?: string
		ranking?: string
		page?: string
	}>
}

export default async function CustomersPage({ searchParams }: PageProps) {
	await requireAuth()
	const params = await searchParams

	// APIパラメータを構築
	const apiParams = {
		search: params.search,
		ranking: params.ranking,
		page: params.page ? parseInt(params.page) : 1,
		per_page: 20, // 1ページあたり20件
	}

	const customersResponse = await getCustomers(apiParams)
	const customers = customersResponse.data

	return (
		<AuthLayout>
			<div className='min-h-screen bg-gray-50'>
				<SubHeader title='顧客管理' />
				<Navigation />

				{/* メインコンテンツ */}
				<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
					<div className='container mx-auto py-6 space-y-6'>
						<div className='flex justify-between items-center'>
							<div>
								<h1 className='text-3xl font-bold'>顧客管理</h1>
								<p className='text-muted-foreground'>
									営業権を獲得したお客様の一覧です
								</p>
							</div>
						</div>

						{/* フィルター */}
						<Card>
							<CardHeader>
								<CardTitle>絞り込み・検索</CardTitle>
							</CardHeader>
							<CardContent>
								<form
									method='GET'
									className='grid grid-cols-1 md:grid-cols-3 gap-4'
								>
									<div className='space-y-2'>
										<Label htmlFor='search'>
											氏名・電話番号・メールアドレス
										</Label>
										<Input
											id='search'
											name='search'
											placeholder='顧客情報で検索'
											defaultValue={params.search || ''}
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='ranking'>順位</Label>
										<Input
											id='ranking'
											name='ranking'
											placeholder='順位で絞り込み (1, 2, 3)'
											type='number'
											min='1'
											max='3'
											defaultValue={params.ranking || ''}
										/>
									</div>
									<div className='flex items-end gap-2'>
										<Button type='submit' className='flex-1'>
											検索
										</Button>
										<Button variant='outline' asChild>
											<Link href='/store/customers'>クリア</Link>
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>

						{/* 検索結果表示 */}
						{(params.search || params.ranking) && (
							<Card>
								<CardContent className='pt-6'>
									<div className='flex items-center gap-4 text-sm text-muted-foreground'>
										<span>
											検索結果: {customersResponse.pagination.total} 件
										</span>
										{params.search && (
											<Badge variant='outline'>顧客情報: {params.search}</Badge>
										)}
										{params.ranking && (
											<Badge variant='outline'>順位: {params.ranking}位</Badge>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* 顧客一覧 */}
						<Card>
							<CardHeader>
								<CardTitle>営業権獲得一覧</CardTitle>
								<CardDescription>
									営業権を獲得した顧客の一覧です。顧客情報、順位、入札金額を確認できます。
								</CardDescription>
							</CardHeader>
							<CardContent>
								{customers.length === 0 ? (
									<div className='text-center py-8'>
										<p className='text-muted-foreground'>
											{params.search || params.ranking
												? '検索条件に一致する顧客がいません。'
												: '営業権を獲得した顧客がいません。'}
										</p>
									</div>
								) : (
									<div className='overflow-x-auto'>
										<Table className='border border-gray-200'>
											<TableHeader>
												<TableRow className='border-b border-gray-200 bg-gray-50'>
													<TableHead className='border-r border-gray-200 font-semibold text-gray-900'>
														氏名
													</TableHead>
													<TableHead className='border-r border-gray-200 font-semibold text-gray-900'>
														電話番号
													</TableHead>
													<TableHead className='border-r border-gray-200 font-semibold text-gray-900'>
														メールアドレス
													</TableHead>
													<TableHead className='border-r border-gray-200 font-semibold text-gray-900'>
														営業権情報
													</TableHead>
													<TableHead className='border-r border-gray-200 font-semibold text-gray-900'>
														入札金額
													</TableHead>
													<TableHead className='border-r border-gray-200 font-semibold text-gray-900'>
														獲得日時
													</TableHead>
													<TableHead className='font-semibold text-gray-900'>
														引っ越し詳細
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{customers.map((customer, index) => (
													<TableRow
														key={customer.id}
														className={`border-b border-gray-200 ${
															index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
														} hover:bg-blue-50`}
													>
														<TableCell className='border-r border-gray-200'>
															<div className='space-y-1'>
																<div className='font-medium font-mono text-sm'>
																	{customer.estimate.name}
																</div>
															</div>
														</TableCell>
														<TableCell className='border-r border-gray-200'>
															<div className='space-y-1'>
																<div className='font-medium font-mono text-sm'>
																	{customer.estimate.phone}
																</div>
															</div>
														</TableCell>
														<TableCell className='border-r border-gray-200'>
															<div className='space-y-1'>
																<div className='font-medium font-mono text-sm'>
																	{customer.estimate.email}
																</div>
															</div>
														</TableCell>
														<TableCell className='border-r border-gray-200'>
															<div className='space-y-2'>
																{getRankingBadge(customer.ranking)}
															</div>
														</TableCell>
														<TableCell className='border-r border-gray-200'>
															<div className='space-y-1'>
																<div className='text-sm font-medium'>
																	{customer.bid_amount_min.toLocaleString()}円
																	～ {customer.bid_amount_max.toLocaleString()}
																	円
																</div>
															</div>
														</TableCell>
														<TableCell className='border-r border-gray-200'>
															<div className='text-sm'>
																{new Date(customer.granted_at).toLocaleString(
																	'ja-JP'
																)}
															</div>
														</TableCell>
														<TableCell className='border-r border-gray-200'>
															<div className='flex justify-center'>
																<CustomerDetailsDialog customer={customer} />
															</div>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
							</CardContent>
						</Card>

						{/* ページネーション情報 */}
						{customersResponse.pagination && (
							<Card>
								<CardContent className='pt-6'>
									<div className='flex justify-between items-center text-sm text-muted-foreground'>
										<div>
											{customersResponse.pagination.from} -{' '}
											{customersResponse.pagination.to} 件目 （全{' '}
											{customersResponse.pagination.total} 件中）
										</div>
										<div>
											ページ {customersResponse.pagination.current_page} /{' '}
											{customersResponse.pagination.last_page}
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
