import { Label } from '@/components/ui/label'
import { getBuildingTypeLabel, getElevatorLabel } from '@/constants/estimate'

interface AddressData {
	zipcode: string
	prefecture: string
	street_address: string
	building_details: string
	building_type: string
	room_layout: string
	floor: string
	elevator: string
}

interface AddressInfoProps {
	address: AddressData
}

export const AddressInfo = ({ address }: AddressInfoProps) => {
	return (
		<div className='bg-gray-50 rounded-lg p-4 space-y-4'>
			<div>
				<Label className='text-sm font-medium text-gray-700 mb-2 block'>
					住所情報
				</Label>
				<div className='flex gap-2'>
					<div>
						<Label className='text-xs font-medium text-gray-600 mb-1 block'>
							郵便番号
						</Label>
						<p className='text-gray-700 bg-white p-3 rounded-md'>
							〒{address.zipcode || 'データなし'}
						</p>
					</div>
					<div>
						<Label className='text-xs font-medium text-gray-600 mb-1 block'>
							都道府県・市区町村・町名・番地
						</Label>
						<p className='text-gray-700 bg-white p-3 rounded-md'>
							{address.prefecture || 'データなし'}{' '}
							{address.street_address || ''}
						</p>
					</div>
					<div>
						<Label className='text-xs font-medium text-gray-600 mb-1 block'>
							建物名・部屋番号
						</Label>
						<p className='text-gray-700 bg-white p-3 rounded-md'>
							{address.building_details || 'データなし'}
						</p>
					</div>
				</div>
			</div>
			<div>
				<Label className='text-sm font-medium text-gray-700 mb-2 block'>
					建物情報
				</Label>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<div>
						<Label className='text-xs font-medium text-gray-600 mb-1 block'>
							建物タイプ
						</Label>
						<p className='text-gray-700 bg-white p-2 rounded text-sm'>
							{getBuildingTypeLabel(address.building_type)}
						</p>
					</div>
					<div>
						<Label className='text-xs font-medium text-gray-600 mb-1 block'>
							間取り
						</Label>
						<p className='text-gray-700 bg-white p-2 rounded text-sm'>
							{address.room_layout || 'データなし'}
						</p>
					</div>
					<div>
						<Label className='text-xs font-medium text-gray-600 mb-1 block'>
							階数
						</Label>
						<p className='text-gray-700 bg-white p-2 rounded text-sm'>
							{address.floor || 'データなし'}
						</p>
					</div>
					<div>
						<Label className='text-xs font-medium text-gray-600 mb-1 block'>
							エレベーター
						</Label>
						<p className='text-gray-700 bg-white p-2 rounded text-sm'>
							{getElevatorLabel(address.elevator)}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
