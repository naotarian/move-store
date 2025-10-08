import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	Phone,
	Mail,
	MapPin,
	Calendar,
	Trophy,
	Users,
	Clock,
	MessageSquare,
	FileText,
	ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

interface PageProps {
	params: Promise<{ id: string }>
}

// モック顧客詳細データ
const mockCustomerDetail = {
	id: '01k5abc123',
	customerName: 'テスト太郎1',
	customerFurigana: 'テストタロウ1',
	customerPhone: '090-1234-5671',
	customerEmail: 'user1@example.com',
	movingDate: '2025-10-15',
	movingFrom: {
		address: '東京都千代田区千代田1-1-1',
		buildingName: 'テストマンション101',
		buildingType: 'マンション',
		floorPlan: '2LDK',
		floor: '3階',
		hasElevator: true,
	},
	movingTo: {
		address: '東京都渋谷区神宮前1-1-1',
		buildingName: '新居マンション101',
		buildingType: 'マンション',
		floorPlan: '3LDK',
		floor: '5階',
		hasElevator: true,
	},
	ranking: 1,
	bidAmount: {
		min: 80000,
		max: 100000,
	},
	status: 'contacted',
	lastContactDate: '2025-09-20',
	businessRightGrantedAt: '2025-09-19 17:05:00',
	peopleCount: 2,
	distance: '12.5km',
	workStartTime: '午前中',
	otherLuggage: 'ピアノ、大型家具',
	luggageItems: [
		{ name: '冷蔵庫', category: '家電', quantity: 1 },
		{ name: '洗濯機', category: '家電', quantity: 1 },
		{ name: 'ソファ', category: '家具', quantity: 1 },
		{ name: 'ダイニングテーブル', category: '家具', quantity: 1 },
	],
	contactHistory: [
		{
			id: 1,
			date: '2025-09-20 10:30',
			type: 'phone',
			content: '初回連絡。引越し日程について確認。お客様は午前中希望。',
			status: 'completed',
		},
		{
			id: 2,
			date: '2025-09-21 14:15',
			type: 'email',
			content: '見積もり詳細をメールで送付。追加オプションについて説明。',
			status: 'completed',
		},
	],
}

const getStatusBadge = (status: string) => {
	const statusConfig = {
		contacted: { label: '連絡済み', variant: 'secondary' as const },
		negotiating: { label: '交渉中', variant: 'default' as const },
		contracted: { label: '契約済み', variant: 'default' as const },
		completed: { label: '完了', variant: 'outline' as const },
	}

	const config =
		statusConfig[status as keyof typeof statusConfig] || statusConfig.contacted
	return <Badge variant={config.variant}>{config.label}</Badge>
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

export default async function CustomerDetailPage({ params }: PageProps) {
	const { id } = await params
	// TODO: APIから顧客データを取得 - const customer = await getCustomerDetail(id)
	const customer = mockCustomerDetail // モックデータ (idは将来のAPI呼び出しで使用予定)

	return (
		<div className='container mx-auto py-6 space-y-6'>
			{/* ヘッダー */}
			<div className='flex items-center gap-4'>
				<Link href='/store/customers'>
					<Button variant='outline' size='sm'>
						<ArrowLeft className='w-4 h-4 mr-2' />
						戻る
					</Button>
				</Link>
				<div>
					<h1 className='text-3xl font-bold'>{customer.customerName}様</h1>
					<p className='text-muted-foreground'>営業権獲得顧客の詳細情報</p>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* 左カラム: 基本情報 */}
				<div className='lg:col-span-2 space-y-6'>
					{/* 顧客基本情報 */}
					<Card>
						<CardHeader>
							<CardTitle>顧客基本情報</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<Label className='text-sm font-medium'>お名前</Label>
									<p className='text-sm'>{customer.customerName}</p>
								</div>
								<div>
									<Label className='text-sm font-medium'>フリガナ</Label>
									<p className='text-sm'>{customer.customerFurigana}</p>
								</div>
								<div>
									<Label className='text-sm font-medium'>電話番号</Label>
									<div className='flex items-center gap-2'>
										<Phone className='w-4 h-4 text-muted-foreground' />
										<p className='text-sm'>{customer.customerPhone}</p>
									</div>
								</div>
								<div>
									<Label className='text-sm font-medium'>メールアドレス</Label>
									<div className='flex items-center gap-2'>
										<Mail className='w-4 h-4 text-muted-foreground' />
										<p className='text-sm'>{customer.customerEmail}</p>
									</div>
								</div>
								<div>
									<Label className='text-sm font-medium'>人数</Label>
									<div className='flex items-center gap-2'>
										<Users className='w-4 h-4 text-muted-foreground' />
										<p className='text-sm'>{customer.peopleCount}人</p>
									</div>
								</div>
								<div>
									<Label className='text-sm font-medium'>引越し日</Label>
									<div className='flex items-center gap-2'>
										<Calendar className='w-4 h-4 text-muted-foreground' />
										<p className='text-sm'>{customer.movingDate}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* 引越し情報 */}
					<Card>
						<CardHeader>
							<CardTitle>引越し情報</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* 引越し元 */}
							<div>
								<Label className='text-sm font-medium'>引越し元</Label>
								<div className='mt-2 p-3 bg-muted rounded-lg space-y-2'>
									<div className='flex items-center gap-2'>
										<MapPin className='w-4 h-4 text-muted-foreground' />
										<p className='text-sm font-medium'>
											{customer.movingFrom.address}
										</p>
									</div>
									<div className='text-sm text-muted-foreground'>
										{customer.movingFrom.buildingName} (
										{customer.movingFrom.buildingType})
									</div>
									<div className='text-sm text-muted-foreground'>
										{customer.movingFrom.floorPlan} /{' '}
										{customer.movingFrom.floor} / エレベーター:{' '}
										{customer.movingFrom.hasElevator ? 'あり' : 'なし'}
									</div>
								</div>
							</div>

							{/* 引越し先 */}
							<div>
								<Label className='text-sm font-medium'>引越し先</Label>
								<div className='mt-2 p-3 bg-muted rounded-lg space-y-2'>
									<div className='flex items-center gap-2'>
										<MapPin className='w-4 h-4 text-muted-foreground' />
										<p className='text-sm font-medium'>
											{customer.movingTo.address}
										</p>
									</div>
									<div className='text-sm text-muted-foreground'>
										{customer.movingTo.buildingName} (
										{customer.movingTo.buildingType})
									</div>
									<div className='text-sm text-muted-foreground'>
										{customer.movingTo.floorPlan} / {customer.movingTo.floor} /
										エレベーター:{' '}
										{customer.movingTo.hasElevator ? 'あり' : 'なし'}
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<Label className='text-sm font-medium'>距離</Label>
									<p className='text-sm'>{customer.distance}</p>
								</div>
								<div>
									<Label className='text-sm font-medium'>作業開始時間</Label>
									<p className='text-sm'>{customer.workStartTime}</p>
								</div>
							</div>

							{customer.otherLuggage && (
								<div>
									<Label className='text-sm font-medium'>その他の荷物</Label>
									<p className='text-sm'>{customer.otherLuggage}</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* 荷物一覧 */}
					<Card>
						<CardHeader>
							<CardTitle>荷物一覧</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{customer.luggageItems.map((item, index) => (
									<div
										key={index}
										className='flex justify-between items-center p-3 bg-muted rounded-lg'
									>
										<div>
											<p className='font-medium'>{item.name}</p>
											<p className='text-sm text-muted-foreground'>
												{item.category}
											</p>
										</div>
										<Badge variant='outline'>{item.quantity}個</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* 右カラム: 営業権情報・連絡履歴 */}
				<div className='space-y-6'>
					{/* 営業権情報 */}
					<Card>
						<CardHeader>
							<CardTitle>営業権情報</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='text-center space-y-2'>
								{getRankingBadge(customer.ranking)}
								<div className='text-lg font-bold'>
									{customer.bidAmount.min.toLocaleString()}円 ～{' '}
									{customer.bidAmount.max.toLocaleString()}円
								</div>
								<div className='text-sm text-muted-foreground'>
									営業権獲得: {customer.businessRightGrantedAt}
								</div>
							</div>
							<Separator />
							<div className='space-y-2'>
								<Label className='text-sm font-medium'>現在のステータス</Label>
								{getStatusBadge(customer.status)}
							</div>
							<div className='space-y-2'>
								<Label className='text-sm font-medium'>最終連絡日</Label>
								<div className='flex items-center gap-2'>
									<Clock className='w-4 h-4 text-muted-foreground' />
									<p className='text-sm'>{customer.lastContactDate}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* ステータス更新 */}
					<Card>
						<CardHeader>
							<CardTitle>ステータス更新</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='status'>ステータス</Label>
								<Select defaultValue={customer.status}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='contacted'>連絡済み</SelectItem>
										<SelectItem value='negotiating'>交渉中</SelectItem>
										<SelectItem value='contracted'>契約済み</SelectItem>
										<SelectItem value='completed'>完了</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button className='w-full'>ステータス更新</Button>
						</CardContent>
					</Card>

					{/* 連絡記録追加 */}
					<Card>
						<CardHeader>
							<CardTitle>連絡記録追加</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='contact-type'>連絡方法</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder='選択してください' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='phone'>電話</SelectItem>
										<SelectItem value='email'>メール</SelectItem>
										<SelectItem value='visit'>訪問</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='contact-content'>連絡内容</Label>
								<Textarea
									id='contact-content'
									placeholder='連絡内容を入力してください'
									rows={3}
								/>
							</div>
							<Button className='w-full'>
								<MessageSquare className='w-4 h-4 mr-2' />
								記録を追加
							</Button>
						</CardContent>
					</Card>

					{/* 連絡履歴 */}
					<Card>
						<CardHeader>
							<CardTitle>連絡履歴</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{customer.contactHistory.map((contact) => (
									<div
										key={contact.id}
										className='border-l-2 border-muted pl-4 space-y-1'
									>
										<div className='flex items-center gap-2'>
											<Badge variant='outline' className='text-xs'>
												{contact.type === 'phone'
													? '電話'
													: contact.type === 'email'
													? 'メール'
													: '訪問'}
											</Badge>
											<span className='text-xs text-muted-foreground'>
												{contact.date}
											</span>
										</div>
										<p className='text-sm'>{contact.content}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* アクションボタン */}
					<div className='space-y-2'>
						<Button className='w-full'>
							<Phone className='w-4 h-4 mr-2' />
							電話をかける
						</Button>
						<Button variant='outline' className='w-full'>
							<Mail className='w-4 h-4 mr-2' />
							メール送信
						</Button>
						<Button variant='outline' className='w-full'>
							<FileText className='w-4 h-4 mr-2' />
							見積書作成
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
