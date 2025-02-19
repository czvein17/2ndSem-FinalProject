import { IoFilterOutline } from 'react-icons/io5'

import { ProductTable } from './ProductTable'
import { ProductsAnalytic } from './ProductsAnalytic'

export const Products = () => {
  console.log('IM RENDERED')

  return (
    <div className='flex flex-col h-full space-y-5'>
      <ProductsAnalytic testValue={'TEST'} />

      <div
        className='flex flex-col h-full px-5 py-3 space-y-2 overflow-hidden bg-white drop-shadow-lg rounded-xl'
        style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
      >
        <div className='flex items-center justify-between flex-shrink-0 py-2 '>
          <h1 className='text-xl font-medium uppercase'>Products</h1>

          <div className='flex items-center gap-2'>
            <button className='px-3 py-2 text-white transition-all duration-150 ease-in-out border rounded-lg border-orange bg-orange hover:bg-transparent hover:text-orange'>
              Add Product
            </button>

            <button className='flex gap-2 px-3 py-2 transition-all duration-150 ease-in-out border rounded-lg text-orange border-orange hover:bg-orange hover:text-white'>
              <span>
                <IoFilterOutline size={24} />
              </span>
              Filters
            </button>

            <button className='flex gap-2 px-3 py-2 transition-all duration-150 ease-in-out border rounded-lg text-orange border-orange hover:bg-orange hover:text-white'>
              Download All
            </button>
          </div>
        </div>

        <ProductTable />
      </div>
    </div>
  )
}
