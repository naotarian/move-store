import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const EstimateNotFound: React.FC = () => {
	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
			<div className='text-center'>
				<h1 className='text-2xl font-bold text-gray-900 mb-4'>
					見積もりが見つかりません
				</h1>
				<p className='text-gray-600 mb-8'>
					指定された見積もりは存在しないか、アクセス権限がありません。
				</p>
				<Link
					href='/store/estimates'
					className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#003672] hover:bg-[#5c6f8b] transition-colors duration-200'
				>
					<ArrowLeft className='h-4 w-4 mr-2' />
					一覧に戻る
				</Link>
			</div>
		</div>
	)
}

export default EstimateNotFound
