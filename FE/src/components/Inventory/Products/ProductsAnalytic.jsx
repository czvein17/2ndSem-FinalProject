import { useQuery } from '@tanstack/react-query'
import React, { memo } from 'react'
import { LuShoppingCart } from 'react-icons/lu'

import { getBestSellingProducts } from '../../../API/sales'
import { getAllProducts } from '../../../API/product'

export const ProductsAnalytic = memo(({ testValue }) => {
  const { data: totalProducts } = useQuery({
    queryKey: ['totalProducts'],
    queryFn: () => getAllProducts(),
  })

  const {
    data: topSellingProducts,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['productAnalytic'],
    queryFn: getBestSellingProducts,
  })

  console.log('ProductsAnalytic Rendered')
  return (
    <div
      className='flex flex-col flex-shrink-0 h-48 p-3 space-y-5 bg-white rounded-xl drop-shadow-lg'
      style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
    >
      <h1 className='font-medium'>Overall Products</h1>

      <div className='grid h-full grid-cols-3 gap-5'>
        <div className='flex flex-col justify-between h-full'>
          <div className='flex flex-col h-full gap-2 px-5'>
            <h4 className='text-lg font-medium'>Total Products</h4>

            <div className='flex items-center gap-4'>
              <LuShoppingCart size={50} />
              <p className='text-2xl font-medium'>{totalProducts?.d?.length}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center h-full bg-black'>
          1
        </div>
        <div className='flex flex-col h-full '>
          <h4 className='font-medium '>Top Preferred Products</h4>
          <ul className=''>
            {topSellingProducts?.d?.map((product, index) => (
              <li key={index}>{product.productName}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
})
