'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import EstimateDetail from '@/components/common/EstimateDetail/EstimateDetail'
import {
	MapPin,
	Calendar,
	Users,
	Clock,
	Building,
	Package,
	Info,
} from 'lucide-react'
import type { Customer } from '@/lib/actions/customers'

interface MovingDetailsDialogProps {
	customer: Customer
	children: React.ReactNode
}

export function MovingDetailsDialog({
	customer,
	children,
}: MovingDetailsDialogProps) {
	const estimate = customer.estimate
	console.log('ダイアログopen')

	// estimateが存在しない場合のエラーハンドリング
	if (!estimate) {
		return (
			<Dialog>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>データエラー</DialogTitle>
						<DialogDescription>
							引っ越し情報が見つかりません。
						</DialogDescription>
					</DialogHeader>
					<div className='text-center py-4'>
						<p className='text-muted-foreground'>
							この顧客の引っ越し情報が正しく取得できませんでした。
						</p>
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Info className='h-5 w-5' />
						引っ越し詳細情報
					</DialogTitle>
					<DialogDescription>
						{estimate.name}様の引っ越し情報の詳細です
					</DialogDescription>
				</DialogHeader>

				<div className='grid gap-6'>
					{/* 顧客基本情報 */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold flex items-center gap-2'>
							<Users className='h-4 w-4' />
							顧客基本情報
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									お名前
								</Label>
								<p className='text-sm font-medium'>{estimate.name}</p>
							</div>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									フリガナ
								</Label>
								<p className='text-sm'>{estimate.name_furigana}</p>
							</div>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									電話番号
								</Label>
								<p className='text-sm'>{estimate.phone}</p>
							</div>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									メールアドレス
								</Label>
								<p className='text-sm'>{estimate.email}</p>
							</div>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									人数
								</Label>
								<p className='text-sm'>{estimate.people_count}人</p>
							</div>
						</div>
					</div>

					<Separator />
					<EstimateDetail estimate={estimate} />

					{/* 引っ越し日程情報 */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold flex items-center gap-2'>
							<Calendar className='h-4 w-4' />
							引っ越し日程
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									引っ越し日タイプ
								</Label>
								<Badge variant='outline'>{estimate.moving_date_type}</Badge>
							</div>
							{estimate.moving_year_month && (
								<div className='space-y-2'>
									<Label className='text-sm font-medium text-muted-foreground'>
										希望年月
									</Label>
									<p className='text-sm'>{estimate.moving_year_month}</p>
								</div>
							)}
							{estimate.moving_period && (
								<div className='space-y-2'>
									<Label className='text-sm font-medium text-muted-foreground'>
										希望期間
									</Label>
									<p className='text-sm'>{estimate.moving_period}</p>
								</div>
							)}
							{estimate.moving_specific_date && (
								<div className='space-y-2'>
									<Label className='text-sm font-medium text-muted-foreground'>
										希望日
									</Label>
									<p className='text-sm'>{estimate.moving_specific_date}</p>
								</div>
							)}
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									作業開始時間タイプ
								</Label>
								<Badge variant='outline'>
									{estimate.work_start_time_type === 'anytime'
										? 'いつでも'
										: '時間指定'}
								</Badge>
							</div>
							{estimate.work_start_time && (
								<div className='space-y-2'>
									<Label className='text-sm font-medium text-muted-foreground'>
										希望時間
									</Label>
									<div className='flex items-center gap-2'>
										<Clock className='h-4 w-4 text-muted-foreground' />
										<p className='text-sm'>
											{estimate.work_start_time === 'morning'
												? '午前中'
												: estimate.work_start_time === 'afternoon'
												? '午後'
												: '夕方'}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<Separator />

					{/* 引っ越し元住所 */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold flex items-center gap-2'>
							<MapPin className='h-4 w-4' />
							引っ越し元
						</h3>
						{estimate.moving_from_address && (
							<div className='bg-muted p-4 rounded-lg space-y-3'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											郵便番号
										</Label>
										<p className='text-sm'>
											{estimate.moving_from_address?.zipcode || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											都道府県
										</Label>
										<p className='text-sm'>
											{estimate.moving_from_address?.prefecture || '-'}
										</p>
									</div>
									<div className='space-y-2 md:col-span-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											住所
										</Label>
										<p className='text-sm'>
											{estimate.moving_from_address?.street_address || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											建物名・部屋番号
										</Label>
										<p className='text-sm'>
											{estimate.moving_from_address?.building_details || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											建物タイプ
										</Label>
										<Badge variant='outline'>
											{estimate.moving_from_address?.building_type || '-'}
										</Badge>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											間取り
										</Label>
										<p className='text-sm'>
											{estimate.moving_from_address?.room_layout || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											階数
										</Label>
										<p className='text-sm'>
											{estimate.moving_from_address?.floor || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											エレベーター
										</Label>
										<Badge
											variant={
												estimate.moving_from_address?.elevator === 'yes'
													? 'default'
													: 'secondary'
											}
										>
											{estimate.moving_from_address?.elevator === 'yes'
												? 'あり'
												: 'なし'}
										</Badge>
									</div>
								</div>
							</div>
						)}
					</div>

					<Separator />

					{/* 引っ越し先住所 */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold flex items-center gap-2'>
							<Building className='h-4 w-4' />
							引っ越し先
						</h3>
						{estimate.moving_to_address && (
							<div className='bg-muted p-4 rounded-lg space-y-3'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											郵便番号
										</Label>
										<p className='text-sm'>
											{estimate.moving_to_address?.zipcode || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											都道府県
										</Label>
										<p className='text-sm'>
											{estimate.moving_to_address?.prefecture || '-'}
										</p>
									</div>
									<div className='space-y-2 md:col-span-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											住所
										</Label>
										<p className='text-sm'>
											{estimate.moving_to_address?.street_address || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											建物名・部屋番号
										</Label>
										<p className='text-sm'>
											{estimate.moving_to_address?.building_details || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											建物タイプ
										</Label>
										<Badge variant='outline'>
											{estimate.moving_to_address?.building_type || '-'}
										</Badge>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											間取り
										</Label>
										<p className='text-sm'>
											{estimate.moving_to_address?.room_layout || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											階数
										</Label>
										<p className='text-sm'>
											{estimate.moving_to_address.floor || '-'}
										</p>
									</div>
									<div className='space-y-2'>
										<Label className='text-sm font-medium text-muted-foreground'>
											エレベーター
										</Label>
										<Badge
											variant={
												estimate.moving_to_address?.elevator === 'yes'
													? 'default'
													: 'secondary'
											}
										>
											{estimate.moving_to_address?.elevator === 'yes'
												? 'あり'
												: 'なし'}
										</Badge>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* 距離情報 */}
					{estimate.straight_distance_km && (
						<>
							<Separator />
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold flex items-center gap-2'>
									<MapPin className='h-4 w-4' />
									距離情報
								</h3>
								<div className='bg-blue-50 p-4 rounded-lg'>
									<div className='flex items-center gap-2'>
										<MapPin className='h-4 w-4 text-blue-600' />
										<span className='text-sm font-medium'>直線距離:</span>
										<span className='text-sm font-bold text-blue-600'>
											{estimate.straight_distance_km} km
										</span>
									</div>
								</div>
							</div>
						</>
					)}

					{/* その他の荷物 */}
					{estimate.other_luggage && (
						<>
							<Separator />
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold flex items-center gap-2'>
									<Package className='h-4 w-4' />
									その他の荷物
								</h3>
								<div className='bg-yellow-50 p-4 rounded-lg'>
									<p className='text-sm'>{estimate.other_luggage}</p>
								</div>
							</div>
						</>
					)}

					<Separator />

					{/* ステータス情報 */}
					<div className='space-y-4'>
						<h3 className='text-lg font-semibold'>ステータス情報</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									メール認証
								</Label>
								<Badge
									variant={estimate.email_verified ? 'default' : 'secondary'}
								>
									{estimate.email_verified ? '認証済み' : '未認証'}
								</Badge>
							</div>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									電話認証
								</Label>
								<Badge
									variant={estimate.phone_verified ? 'default' : 'secondary'}
								>
									{estimate.phone_verified ? '認証済み' : '未認証'}
								</Badge>
							</div>
							<div className='space-y-2'>
								<Label className='text-sm font-medium text-muted-foreground'>
									ステータス
								</Label>
								<Badge variant='outline'>{estimate.status}</Badge>
							</div>
							{estimate.bid_deadline && (
								<div className='space-y-2'>
									<Label className='text-sm font-medium text-muted-foreground'>
										入札期限
									</Label>
									<p className='text-sm'>
										{new Date(estimate.bid_deadline).toLocaleString('ja-JP')}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
