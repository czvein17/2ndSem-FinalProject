import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getAllIngredients } from '../../../API/stocks'

export const StockAlert = () => {
  const {
    data: stockAlert,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['stockAlert'],
    queryFn: getAllIngredients,
  })

  return (
    <div
      className='overflow-auto bg-white rounded-lg custom-scrollbar'
      style={{ maxHeight: '350px' }}
    >
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='sticky top-0 bg-orange'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Name
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Alert Count
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Stock Remaining
            </th>
          </tr>
        </thead>
        <tbody className=''>
          {stockAlert?.d?.map((item, index) => (
            <tr key={item._id} className='border-b border-orange'>
              <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                {item.name}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.lowStockThreshold}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.stock} <span className='uppercase'>{item.unit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
