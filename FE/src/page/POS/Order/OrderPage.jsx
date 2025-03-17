import { useQuery } from '@tanstack/react-query'
import { getAllOrders } from '../../../API/order'

import { FcCancel } from 'react-icons/fc'
import { FaRegEye } from 'react-icons/fa'
import { MdOutlinePayments } from 'react-icons/md'
import { CgSearch } from 'react-icons/cg'

import { OrderTable } from '../../../components/POS/order/orderTable'
import { ModalWrapper } from '../../../components/ModalWrapper'
import { ViewOrderModal } from '../../../components/User/ViewOrderModal'
import { useEffect, useState } from 'react'

export const OrderPage = () => {
  const [search, setSearch] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000)

    return () => clearTimeout(handler)
  }, [search])

  console.log(debounceSearch)

  const queryParams = {
    sort: '-status,-createdAt',
    searchBy: '_id',
    search: debounceSearch,
  }

  const {
    data: orders,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => getAllOrders(queryParams),
  })

  return (
    <div className='flex flex-col h-full gap-2 p-5'>
      <div className='flex items-center justify-between flex-shrink-0 h-20 '>
        {/* SEACH BAR */}
        <div
          className='flex items-center gap-2 px-3 py-2 bg-white rounded-full w-80'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
        >
          <span>
            <CgSearch size={25} />
          </span>
          <input
            type='text'
            className='w-full bg-transparent outline-none'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* {!isPending && !isError && ( */}
      <div className='h-full overflow-hidden'>
        <OrderTable orders={orders} isOrderLoading={isPending} />
      </div>
      {/* )} */}

      <ViewOrderModal />
    </div>
  )
}
