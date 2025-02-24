import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { getProductById } from '../../../API/product'

import { FiEdit2 } from 'react-icons/fi'
import { IoIosArrowBack } from 'react-icons/io'

import { PrimaryDetails } from './PrimaryDetails'
import { ProductPurchases } from './ProductPurchases'

export const ViewProduct = () => {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParams = searchParams.get('tab')
  const navigate = useNavigate()

  const {
    data: coffee,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['coffee'],
    queryFn: () => getProductById(id),
  })

  useEffect(() => {
    if (!searchParams.has('tab')) {
      searchParams.set('tab', 'overview')
      setSearchParams(searchParams)
    }
  }, [searchParams, setSearchParams])

  const switchTab = (tab) => {
    setSearchParams({ tab })
  }

  const tabs = [
    {
      name: 'Overview',
      value: 'overview',
    },
    {
      name: 'Purchase',
      value: 'purchase',
    },
  ]

  return (
    <div className='flex flex-col h-full p-5 bg-white shadow-xl rounded-xl'>
      {!isPending && !isError && (
        <>
          <div className='flex items-center justify-between py-1 '>
            <div className='flex items-center gap-5'>
              <button
                onClick={() => navigate('/inventory/products')}
                className='flex items-center gap-2 p-2 transition-all duration-100 ease-in-out rounded-full hover:bg-orange hover:text-white'
              >
                <IoIosArrowBack size={40} />
              </button>
              <h1 className='text-3xl font-medium uppercase '>{coffee.d.name}</h1>
            </div>

            <div className='flex space-x-2'>
              <button className='flex items-center gap-2 px-4 py-2 transition-all duration-100 ease-in-out border rounded border-orange text-orange hover:bg-orange hover:text-white hover:border-orange'>
                <FiEdit2 size={20} />
                Edit
              </button>

              <button className='flex items-center gap-2 px-4 py-2 transition-all duration-100 ease-in-out border rounded border-orange text-orange hover:bg-orange hover:text-white hover:border-orange'>
                Download
              </button>
            </div>
          </div>

          <ul className='flex py-5 font-medium gap-7'>
            {tabs.map((tab, index) => (
              <li
                key={index}
                onClick={() => switchTab(tab.value)}
                className={`py-2 relative w-[120px] text-[#3B3B3B] cursor-pointer text-center  ${tab.value === tabParams ? 'text-opacity-100' : 'text-opacity-50'}`}
              >
                {tab.name}
                {tab.value === tabParams && (
                  <motion.div
                    className='absolute bottom-0 w-full h-[3px] rounded-full bg-orange'
                    layoutId='underline'
                    initial={false}
                    animate={{ x: tab.value === tabParams ? 0 : '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>

          {tabParams === 'overview' && <PrimaryDetails coffee={coffee.d} />}
          {tabParams === 'purchase' && <ProductPurchases productId={coffee.d._id} />}
        </>
      )}
    </div>
  )
}
