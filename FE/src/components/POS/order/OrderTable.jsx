import { FcCancel } from 'react-icons/fc'
import { FaRegEye } from 'react-icons/fa'
import { MdOutlinePayments } from 'react-icons/md'

export const OrderTable = ({ orders }) => {
  return (
    <div className='w-full h-full overflow-x-auto'>
      <table className='table-fixed lg:w-full'>
        <thead className='h-[50px] w-full border-b-black border-b-2 bg-orange text-white'>
          <tr className=''>
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
                  <button className='p-2 text-orange' title='View Order'>
                    <FaRegEye size={25} />
                  </button>

                  <button className='p-2 text-orange' title='Cancel Order'>
                    <FcCancel size={25} />
                  </button>

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
      </table>
    </div>
  )
}
