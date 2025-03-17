import { useQuery } from '@tanstack/react-query'
import { ProductTable } from './ProductTable'
import { ProductsAnalytic } from './ProductsAnalytic'

export const Products = () => {
  return (
    <div className='flex flex-col h-full space-y-5'>
      <ProductsAnalytic testValue={'TEST'} />

      <div
        className='flex flex-col h-full px-5 py-3 space-y-2 overflow-hidden bg-white drop-shadow-lg rounded-xl'
        style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
      >
        <ProductTable />
      </div>
    </div>
  )
}
