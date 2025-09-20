export interface BidData {
	id: string
	storeName: string
	minPrice: number
	maxPrice: number
	submittedAt: string
	isCurrentStore: boolean
}

export const mockBids: BidData[] = [
	{
		id: '1',
		storeName: 'サンプル引越し店',
		minPrice: 150000,
		maxPrice: 180000,
		submittedAt: '2024-01-15T10:30:00Z',
		isCurrentStore: true,
	},
	{
		id: '2',
		storeName: '関東引越しセンター',
		minPrice: 120000,
		maxPrice: 150000,
		submittedAt: '2024-01-15T09:15:00Z',
		isCurrentStore: false,
	},
	{
		id: '3',
		storeName: '東京引越しサービス',
		minPrice: 120000,
		maxPrice: 160000,
		submittedAt: '2024-01-15T08:45:00Z',
		isCurrentStore: false,
	},
	{
		id: '4',
		storeName: 'スピード引越し',
		minPrice: 180000,
		maxPrice: 200000,
		submittedAt: '2024-01-15T07:20:00Z',
		isCurrentStore: false,
	},
]

export const sortBidsByPrice = (bids: BidData[]): BidData[] => {
	return [...bids].sort((a, b) => {
		if (a.minPrice !== b.minPrice) {
			return a.minPrice - b.minPrice
		}
		return a.maxPrice - b.maxPrice
	})
}
