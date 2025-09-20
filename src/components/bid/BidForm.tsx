import React from 'react'
import { Gavel, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import NoBidRightMessage from './NoBidRightMessage'
import { submitBid } from '@/lib/actions/bids/submit-bid'
import { clearMessages } from '@/lib/actions/clear-messages'
import { BidRightData, BidData } from '@/app/store/estimates/[id]/bid/data'

interface BidFormProps {
	estimateId: string
	bidRightData: BidRightData | null
	existingBid?: BidData | null
	successMessage?: string
	errorMessage?: string
}

const BidForm: React.FC<BidFormProps> = ({
	estimateId,
	bidRightData,
	existingBid,
	successMessage,
	errorMessage,
}) => {
	console.log(bidRightData)
	// 入札権データが存在しない、または入札権がない場合
	if (bidRightData && !bidRightData?.hasBidRight) {
		return (
			<NoBidRightMessage estimateId={estimateId} bidRightData={bidRightData} />
		)
	}

	return (
		<Card className='overflow-hidden pt-0'>
			<CardHeader className='bg-green-600 text-white py-4'>
				<CardTitle className='flex items-center gap-2 text-base font-medium'>
					<Gavel className='h-5 w-5' />
					{existingBid ? '入札を更新' : '入札する'}
				</CardTitle>
			</CardHeader>
			<CardContent className='p-6'>
				{/* 成功・エラーメッセージ */}
				{successMessage && (
					<Alert className='mb-4 border-green-200 bg-green-50 relative'>
						<AlertDescription className='text-green-700 pr-8'>
							{successMessage}
						</AlertDescription>
						<form action={clearMessages} className='absolute top-2 right-2'>
							<Button
								type='submit'
								variant='ghost'
								size='sm'
								className='h-6 w-6 p-0'
							>
								×
							</Button>
						</form>
					</Alert>
				)}

				{errorMessage && (
					<Alert
						className='mb-4 border-red-200 bg-red-50 relative'
						variant='destructive'
					>
						<AlertDescription className='text-red-700 pr-8'>
							{errorMessage}
						</AlertDescription>
						<form action={clearMessages} className='absolute top-2 right-2'>
							<Button
								type='submit'
								variant='ghost'
								size='sm'
								className='h-6 w-6 p-0'
							>
								×
							</Button>
						</form>
					</Alert>
				)}

				{/* 既存入札がある場合の表示 */}
				{existingBid && (
					<Alert className='mb-4'>
						<AlertDescription>
							現在の入札: {existingBid.min_price.toLocaleString()}円 〜{' '}
							{existingBid.max_price.toLocaleString()}円
							<br />
							<span className='text-sm text-gray-500'>
								提出日時:{' '}
								{new Date(existingBid.created_at).toLocaleString('ja-JP')}
							</span>
						</AlertDescription>
					</Alert>
				)}

				<form action={submitBid} className='space-y-6'>
					{/* 隠しフィールド */}
					<input type='hidden' name='estimateId' value={estimateId} />

					{/* 金額入力 */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='minPrice'>下限金額（円）</Label>
							<Input
								id='minPrice'
								name='minPrice'
								type='number'
								placeholder='例: 150000'
								defaultValue={existingBid?.min_price}
								required
								min={0}
								step={1000}
							/>
							<p className='text-xs text-gray-500'>
								この金額以上で作業を受注可能
							</p>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='maxPrice'>上限金額（円）</Label>
							<Input
								id='maxPrice'
								name='maxPrice'
								type='number'
								placeholder='例: 180000'
								defaultValue={existingBid?.max_price}
								required
								min={0}
								step={1000}
							/>
							<p className='text-xs text-gray-500'>この金額以下で作業を提供</p>
						</div>
					</div>

					{/* メッセージ入力 */}
					<div className='space-y-2'>
						<Label htmlFor='message' className='flex items-center gap-2'>
							<MessageSquare className='h-4 w-4' />
							メッセージ（任意）
						</Label>
						<Textarea
							id='message'
							name='message'
							placeholder='お客様へのアピールポイントやサービス内容について記載してください'
							defaultValue={existingBid?.message}
							rows={3}
							maxLength={500}
						/>
						<p className='text-xs text-gray-500'>500文字以内でご記入ください</p>
					</div>

					{/* 送信ボタン */}
					<div className='flex justify-end pt-4'>
						<Button
							type='submit'
							className='bg-green-600 hover:bg-green-700 px-8'
							size='lg'
						>
							<Gavel className='h-4 w-4 mr-2' />
							{existingBid ? '入札を更新' : '入札を提出'}
						</Button>
					</div>
				</form>

				{/* 入札権の有効期限表示 */}
				{bidRightData && bidRightData.expiresAt && (
					<div className='mt-4 pt-4 border-t border-gray-200'>
						<p className='text-xs text-gray-500'>
							入札権有効期限:{' '}
							{new Date(bidRightData.expiresAt).toLocaleString('ja-JP')}
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default BidForm
