import { FcCancel } from 'react-icons/fc'
import { FaRegEye } from 'react-icons/fa'
import { MdOutlinePayments } from 'react-icons/md'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { deleteOrder, updateOrderStatus } from '../../../API/order'
import { queryClient } from '../../../API/http'
import { toast } from 'react-toastify'

export const OrderTable = ({ orders, isOrderLoading }) => {
  const navigate = useNavigate()

  const {
    mutate: markAsCompleteMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries('orders')
      toast.success(`Order for ${data.d.recipient} has been complete`)
    },
  })

  const {
    mutate: cancelOrderMutation,
    isPending: cancelOrderIsPending,
    isError: cancelOrderIsError,
    error: cancelOrderError,
  } = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries('orders')
      toast.success('Order has been cancelled')
    },
  })

  const markAsComplete = (id) => {
    console.log('Im HERE')
    markAsCompleteMutation({ orderId: id, status: 'completed' })
  }

  const viewOrder = (id) => {
    navigate(`/user/orders?id=${id}`)
  }

  return (
    <div className='w-full h-full overflow-x-auto custom-scrollbar'>
      <table className='flex-shrink-0 table-fixed lg:w-full'>
        <thead className='h-[50px] w-full border-b-black border-b-2 bg-orange text-white sticky top-0'>
          <tr>
            <th scope='col' className='font-medium first:rounded-tl-2xl'>
              Order ID
            </th>
            <th scope='col' className='font-medium'>
              Order Date
            </th>

            <th scope='col' className='font-medium'>
              Recipient
            </th>
            {/* <th scope='col'>Customer Name</th> */}
            <th scope='col' className='font-medium'>
              Total
            </th>
            <th scope='col' className='font-medium'>
              Order Status
            </th>
            <th scope='col' className='font-medium'>
              Payment Status
            </th>
            <th scope='col' className='last:rounded-tr-2xl'>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.d?.map((order, index) => (
            <tr
              key={order._id}
              className={`${index % 2 === 0 ? 'bg-white' : ''} border-b border-b-black`}
            >
              <td className='px-4 py-3 whitespace-nowrap'>{order._id}</td>
              <td className='px-4 py-3 whitespace-normal'>
                {new Date(order.createdAt).toLocaleString()}
              </td>

              <td className='px-4 py-3 whitespace-nowrap'>{order.recipient}</td>

              <td className='px-4 py-3 whitespace-nowrap'>
                <span>&#8369;</span> {order.totalAmount}
              </td>

              <td className='px-4 py-3 uppercase whitespace-nowrap'>
                {order.status}
              </td>
              <td className='px-4 py-3 uppercase whitespace-nowrap'>
                {order.sales?.paymentStatus}
              </td>

              <td className='flex px-4 py-3 whitespace-nowrap'>
                <div className='mx-auto'>
                  <button
                    className='p-2 text-orange'
                    title='View Order'
                    onClick={() => viewOrder(order._id)}
                  >
                    <FaRegEye size={25} />
                  </button>

                  {order?.sales?.paymentStatus !== 'paid' && (
                    <button
                      className='p-2 text-orange'
                      title='Cancel Order'
                      onClick={() => cancelOrderMutation(order._id)}
                    >
                      <FcCancel size={25} />
                    </button>
                  )}

                  {order?.sales?.paymentStatus === 'paid' &&
                    order?.status === 'pending' && (
                      <button
                        className='p-2 text-orange'
                        title='Mark as complete'
                        onClick={() => markAsComplete(order._id)}
                      >
                        <FaRegCircleCheck size={25} />
                      </button>
                    )}

                  {order?.sales?.paymentStatus === 'failed' && (
                    <button className='p-2 text-orange' title='Re-pay Order'>
                      <MdOutlinePayments size={25} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>

        {isOrderLoading && (
          <tfoot className='h-14'>
            <tr>
              <td colSpan='7' className='text-center text-[#3b3b3b80] font-medium'>
                Loading...
              </td>
            </tr>
          </tfoot>
        )}

        {orders?.d?.length === 0 && (
          <tfoot className='h-14'>
            <tr>
              <td colSpan='7' className='text-center text-[#3b3b3b80] font-medium'>
                No order found
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
