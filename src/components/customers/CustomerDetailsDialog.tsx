'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import EstimateDetail from '@/components/common/EstimateDetail/EstimateDetail'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
	Info,
	Trophy,
	Users,
	MapPin,
	Calendar,
	Package,
	Home,
} from 'lucide-react'
import type { Customer } from '@/lib/actions/customers'

interface CustomerDetailsDialogProps {
	customer: Customer
}

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

export function CustomerDetailsDialog({
	customer,
}: CustomerDetailsDialogProps) {
	console.log('ダイアログopen')
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' variant='outline'>
					<Info className='w-4 h-4 mr-1' />
					詳細
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-[95vw] w-full max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<Info className='h-5 w-5' />
						引っ越し詳細情報
					</DialogTitle>
					<DialogDescription>
						{customer.estimate?.name || 'データなし'}
						様の引っ越し情報の詳細です
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6 py-4'>
					{/* 顧客基本情報（営業権獲得のため表示） */}
					<div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
						<h3 className='text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2'>
							<Users className='h-5 w-5' />
							顧客情報（営業権獲得済み）
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div>
								<Label className='text-sm font-medium text-blue-700'>
									お名前
								</Label>
								<p className='text-sm font-medium text-blue-900 bg-white p-2 rounded'>
									{customer.estimate?.name || 'データなし'}
								</p>
							</div>
							<div>
								<Label className='text-sm font-medium text-blue-700'>
									電話番号
								</Label>
								<p className='text-sm text-blue-900 bg-white p-2 rounded'>
									{customer.estimate?.phone || 'データなし'}
								</p>
							</div>
							<div>
								<Label className='text-sm font-medium text-blue-700'>
									メールアドレス
								</Label>
								<p className='text-sm text-blue-900 bg-white p-2 rounded'>
									{customer.estimate?.email || 'データなし'}
								</p>
							</div>
						</div>
						<div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div>
								<Label className='text-sm font-medium text-blue-700'>
									営業権順位
								</Label>
								<div className='mt-1'>{getRankingBadge(customer.ranking)}</div>
							</div>
							<div>
								<Label className='text-sm font-medium text-blue-700'>
									入札金額
								</Label>
								<p className='text-sm font-medium text-blue-900 bg-white p-2 rounded'>
									{customer.bid_amount_min?.toLocaleString() || '0'}円 ～{' '}
									{customer.bid_amount_max?.toLocaleString() || '0'}円
								</p>
							</div>
							<div>
								<Label className='text-sm font-medium text-blue-700'>
									獲得日時
								</Label>
								<p className='text-sm text-blue-900 bg-white p-2 rounded'>
									{new Date(customer.granted_at).toLocaleString('ja-JP')}
								</p>
							</div>
						</div>
					</div>

					<Separator />
					<EstimateDetail estimate={customer.estimate} />
					<Separator />

					{/* その他の荷物 */}
					{customer.estimate?.other_luggage && (
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
								<Package className='h-5 w-5' />
								上記以外の家財
							</h3>
							<div className='bg-gray-50 rounded-lg p-4'>
								<p className='text-gray-700 whitespace-pre-wrap'>
									{customer.estimate.other_luggage}
								</p>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
