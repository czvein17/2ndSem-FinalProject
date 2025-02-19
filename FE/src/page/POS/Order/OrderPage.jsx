import { useQuery } from '@tanstack/react-query'
import { getAllOrders } from '../../../API/order'

import { FcCancel } from 'react-icons/fc'
import { FaRegEye } from 'react-icons/fa'
import { MdOutlinePayments } from 'react-icons/md'
import { CgSearch } from 'react-icons/cg'

import { OrderTable } from '../../../components/POS/order/orderTable'

export const OrderPage = () => {
  const {
    data: orders,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
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
          <input type='text' className='w-full bg-transparent outline-none' />
        </div>
      </div>
      {!isPending && !isError && (
        <div className='h-full overflow-hidden'>
          <OrderTable orders={orders} />
        </div>
      )}
    </div>
  )
}
