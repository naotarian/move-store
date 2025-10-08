'use client'
import { useActionState, useEffect, useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DialogContent } from '@/components/ui/dialog'
import { DialogHeader } from '@/components/ui/dialog'
import { DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@/components/ui/dialog'
import { DialogFooter } from '@/components/ui/dialog'
import { DialogClose } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
	CheckCircle,
	AlertTriangle,
	Lock,
	Unlock,
	Zap,
	ArrowRight,
	Star,
	Trophy,
} from 'lucide-react'
import {
	BidRightState,
	getBidRightAction,
} from '@/app/utils/actions/bid-right/submitBidRight'

const BitRightDialog = ({ estimateId }: { estimateId: string }) => {
	const [state, formAction, isPending] = useActionState<
		BidRightState,
		FormData
	>(getBidRightAction, { ok: undefined })
	const isSuccess = state.ok === true
	const isError = state.ok === false
	const [countdown, setCountdown] = useState<number | null>(null)

	// 成功時の自動リロード処理
	useEffect(() => {
		if (isSuccess) {
			setCountdown(5)
			const timer = setInterval(() => {
				setCountdown((prev) => {
					if (prev === null || prev <= 1) {
						clearInterval(timer)
						window.location.reload()
						return null
					}
					return prev - 1
				})
			}, 1000)

			return () => clearInterval(timer)
		}
	}, [isSuccess])

	// 手動リロード関数
	const handleManualReload = () => {
		window.location.reload()
	}

	return (
		<Dialog>
			<Card className='mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden'>
				{/* 背景装飾 */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-100/30 rounded-full translate-y-12 -translate-x-12'></div>

				<CardHeader className='pb-4 relative z-10'>
					<div className='flex items-center gap-4'>
						<div className='flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full shadow-md'>
							<Lock className='h-8 w-8 text-blue-600' />
						</div>
						<div className='flex-1'>
							<CardTitle className='text-blue-800 text-xl font-bold mb-2 flex items-center gap-2'>
								入札権が必要です
								<Star className='h-5 w-5 text-yellow-500' />
							</CardTitle>
							<p className='text-blue-600 text-sm'>
								この見積もりに入札するには、まず入札権を取得してください
							</p>
						</div>
					</div>
				</CardHeader>

				<CardContent className='pt-0 relative z-10'>
					<div className='bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-100 mb-4'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
							<div className='flex items-center gap-3 p-3 bg-blue-50/50 rounded-lg'>
								<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
									<Unlock className='h-5 w-5 text-blue-600' />
								</div>
								<div>
									<p className='font-medium text-gray-900 text-sm'>
										入札権取得
									</p>
									<p className='text-xs text-gray-600'>簡単な手続き</p>
								</div>
							</div>

							<div className='flex items-center gap-3 p-3 bg-green-50/50 rounded-lg'>
								<div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
									<Zap className='h-5 w-5 text-green-600' />
								</div>
								<div>
									<p className='font-medium text-gray-900 text-sm'>
										即座に入札
									</p>
									<p className='text-xs text-gray-600'>すぐに参加可能</p>
								</div>
							</div>

							<div className='flex items-center gap-3 p-3 bg-amber-50/50 rounded-lg'>
								<div className='w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center'>
									<Trophy className='h-5 w-5 text-amber-600' />
								</div>
								<div>
									<p className='font-medium text-gray-900 text-sm'>
										営業権獲得
									</p>
									<p className='text-xs text-gray-600'>ビジネス拡大</p>
								</div>
							</div>
						</div>

						<div className='flex items-center justify-between'>
							<div>
								<h4 className='font-semibold text-gray-900 mb-1'>
									今すぐ入札権を取得しましょう
								</h4>
								<p className='text-sm text-gray-600'>
									競合他社に先駆けて、このチャンスを掴みましょう
								</p>
							</div>
							<DialogTrigger asChild>
								<Button size='lg'>
									入札権を取得
									<ArrowRight className='h-4 w-4' />
								</Button>
							</DialogTrigger>
						</div>
					</div>

					<div className='flex items-center justify-center text-xs text-blue-700 bg-blue-100/50 px-4 py-2 rounded-md'>
						<Lock className='h-4 w-4 mr-2' />
						入札権取得後、すぐに入札を開始できます
					</div>
				</CardContent>
			</Card>
			<DialogContent className='sm:max-w-[425px]'>
				<form action={formAction}>
					<input type='hidden' name='estimateId' value={estimateId} />
					<DialogHeader>
						<DialogTitle>入札権を取得</DialogTitle>
						<DialogDescription>
							以下の内容を確認し、入札権を取得してください。
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4'>
						{/* 成功時のメッセージ */}
						{isSuccess && (
							<Alert className='border-green-200 bg-green-50'>
								<CheckCircle className='h-4 w-4 text-green-600' />
								<AlertDescription className='text-green-800'>
									<div className='space-y-3'>
										<p className='font-medium'>
											入札権を取得しました！入札が可能になりました。
										</p>
										<div className='text-sm'>
											<p className='mb-2'>
												{countdown !== null
													? `・${countdown}秒後に自動で画面が切り替わります。切り替わるまでお待ちください。`
													: '・画面を切り替えています...'}
											</p>
											<p>
												切り替わらない場合は
												<button
													onClick={handleManualReload}
													className='text-green-700 underline hover:text-green-900 ml-1'
												>
													こちらをクリック
												</button>
											</p>
										</div>
									</div>
								</AlertDescription>
							</Alert>
						)}

						{/* エラー時のメッセージ */}
						{isError && (
							<Alert variant='destructive' className='my-4'>
								<AlertTriangle className='h-4 w-4' />
								<AlertDescription>
									<div className='space-y-2'>
										<p>{state.message || '入札権の取得に失敗しました。'}</p>
									</div>
								</AlertDescription>
							</Alert>
						)}

						{/* 通常時の説明 */}
						{!isSuccess && !isError && (
							<div className='grid gap-3'>
								<p className='text-sm'>
									・入札権を取得することで、入札が可能になります。
								</p>
								<p className='text-sm'>
									・入札権を取得した段階では、営業権は獲得できません。
								</p>
								<p className='text-sm'>
									・入札の結果によっては営業権が取得できない場合があります。
								</p>
							</div>
						)}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant='outline'>キャンセル</Button>
						</DialogClose>
						<Button type='submit' disabled={isPending || isSuccess}>
							{isPending ? '取得中…' : isSuccess ? '取得完了' : '入札権を取得'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default BitRightDialog
