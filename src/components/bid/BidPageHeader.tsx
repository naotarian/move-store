import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'

interface BidPageHeaderProps {
	estimateId: string
}

const BidPageHeader: React.FC<BidPageHeaderProps> = ({ estimateId }) => {
	return (
		<div className='flex justify-between items-center mb-6'>
			<Link
				href='/store/estimates'
				className='inline-flex items-center text-gray-600 hover:text-gray-900'
			>
				<ArrowLeft className='h-5 w-5 mr-1' />
				見積もり一覧に戻る
			</Link>
			<Link
				href={`/store/estimates/${estimateId}`}
				className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
			>
				<Eye className='h-4 w-4 mr-2' />
				詳細を見る
			</Link>
		</div>
	)
}

export default BidPageHeader
