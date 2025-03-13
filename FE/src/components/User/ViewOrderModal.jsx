import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { SlClose } from 'react-icons/sl'
import { useLocation, useNavigate } from 'react-router-dom'

import { getOrder, updateOrderStatus } from '../../API/order'

import CUP_OF_CHI from '../../assets/images/logo.svg'
import CashLogo from '../../assets/icons/cash-logo.svg'
import MayaLogo from '../../assets/icons/maya-logo.svg'

import { queryClient } from '../../API/http'

export const ViewOrderModal = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [cashPayment, setCashPayment] = useState(false)
  const [cashAmount, setCashAmount] = useState(0)

  useEffect(() => {
    const searhParams = new URLSearchParams(location.search)
    const orderId = searhParams.get('id')

    if (orderId) {
      setIsViewOrderOpen(true)
      setOrderId(orderId)
    }
  }, [location])

  const {
    data: order,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['order'],
    queryFn: () => getOrder(orderId),
    enabled: isViewOrderOpen,
  })

  console.log(order?.d)

  const { mutate: markAsCompleteMutation } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries('orders')
      queryClient.invalidateQueries('order')
    },
  })

  const handleMarkAsComplete = () => {
    markAsCompleteMutation({ orderId, status: 'completed' })
  }

  const handlePayment = () => {
    navigate(`/user?order=${orderId}`)
  }

  const toggleCashPayment = () => setCashPayment(!cashPayment)

  const closeViewOrderModal = () => {
    setIsViewOrderOpen(!isViewOrderOpen)
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete('id')
    navigate(`/user/orders?${searchParams.toString()}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
    const year = String(date.getFullYear()).slice(-2)
    return `${month}/${day}/${year}`
  }

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    return new Date(dateString).toLocaleTimeString(undefined, options)
  }

  const orderDetails = [
    {
      label: 'Subtotal',
      value: order?.d?.subTotal,
    },

    {
      label: 'Tax',
      value: order?.d?.subTotal,
    },

    {
      label: 'Discount',
      value: order?.d?.discountAmount,
    },

    {
      label: 'Total',
      value: order?.d?.totalAmount,
    },
    {
      label: 'Recieve Amount',
      value: order?.d?.sales?.receivedAmount || 0,
    },

    {
      label: 'Change',
      value: order?.d?.sales?.change || 0,
    },
    {
      label: 'Mode of Payment',
      value: order?.d?.sales?.modeOfPayment || 'N/A',
    },
    {
      label: 'Payment Status',
      value: order?.d?.sales?.paymentStatus || 'N/A',
    },
    {
      label: 'Order Status',
      value: order?.d?.status,
    },
  ]

  const paymentOptions = [
    {
      title: 'Cash',
      icon: CashLogo,
      onClick: toggleCashPayment,
    },
    {
      title: 'PayMaya',
      icon: MayaLogo,
      //   onClick: handlePaymayaPayment,
    },
  ]

  if (!isViewOrderOpen) return null

  return ReactDOM.createPortal(
    <div className='fixed top-0 left-0 w-[100%] h-[100%] bg-[#00000090] flex justify-center items-center'>
      <div className='relative w-full  mx-5 bg-background rounded-xl md:w-auto lg:w-[800px] lg:h-[800px] flex flex-col font-poppins'>
        <div className='relative px-5 py-2 font-medium text-white bg-orange rounded-t-xl'>
          <h1 className='text-xl font-medium text-center'>View Order</h1>

          <button
            className='absolute top-2 right-2 rounded-tr-xl '
            onClick={closeViewOrderModal}
          >
            <SlClose size={24} />
          </button>
        </div>

        <div className='flex justify-between h-full overflow-hidden'>
          <div className='w-full p-5 space-y-4 overflow-y-auto custom-scrollbar'>
            {order?.d?.orderItems?.map((item) => (
              <div
                key={item._id}
                className='flex gap-5 px-3 py-3 bg-white shadow-lg rounded-xl'
                style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.5)' }}
              >
                <div className='w-20 h-20 my-auto'>
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${item.product.image}`}
                    alt={item.product.image}
                    className='object-contain w-full h-full rounded-xl'
                  />
                </div>

                <div className='my-auto text-sm font-medium'>
                  <h1 className='text-base font-semibold text-orange'>
                    {item.product.name}
                  </h1>
                  <h1>
                    qty: &nbsp;
                    <span className='font-semibold text-orange'>
                      {item.quantity}
                    </span>
                  </h1>
                  <h1>
                    Price: &nbsp;
                    <span className='font-semibold text-orange'>
                      &#8369;
                      {item.price}
                    </span>
                  </h1>
                </div>
              </div>
            ))}
          </div>

          <div className='w-1 h-full  bg-[#D9D9D9] rounded-full' />

          <div className='flex flex-col justify-between w-full h-full gap-5'>
            <div className='flex flex-col px-5 py-2 space-y-5 rounded-xl'>
              <div className='w-full h-28 '>
                <img
                  src={CUP_OF_CHI}
                  alt=''
                  className='object-contain w-full h-full'
                />
              </div>

              <div className='font-medium uppercase'>
                <h1>
                  Order ID: <span className='text-orange'>{order?.d?._id}</span>
                </h1>
                <h1>
                  Created At:{' '}
                  <span className='text-orange'>
                    {formatDate(order?.d?.createdAt)}{' '}
                    {formatTime(order?.d?.createdAt)}
                  </span>
                </h1>

                <h1>
                  recipient: &nbsp;
                  <span className='text-orange'>{order?.d?.recipient}</span>
                </h1>
              </div>
            </div>

            <ul className='px-5 mb-auto '>
              {orderDetails.map((detail, index) => (
                <li
                  key={index}
                  className='flex justify-between px-1 py-2 font-medium border-b-2 border-black'
                >
                  <h1 className='text-orange'>{detail.label} :</h1>
                  <h1>
                    {detail.label === 'Payment Status' ||
                    detail.label === 'Mode of Payment' ||
                    detail.label === 'Order Status' ? (
                      ''
                    ) : (
                      <span>&#8369;</span>
                    )}
                    <span className='uppercase'>{detail.value}</span>
                  </h1>
                </li>
              ))}
            </ul>

            <div className='h-full px-5 pt-10 mx-auto '>
              {order?.d?.status === 'pending' && order?.d?.sales && (
                <button
                  className='px-5 py-2 text-white transition-all duration-150 ease-in-out border border-transparent bg-orange rounded-xl hover:bg-transparent hover:border-orange hover:text-orange'
                  onClick={handleMarkAsComplete}
                >
                  Mark As Complete
                </button>
              )}

              {!order?.d?.sales && (
                <button
                  className='px-5 py-2 text-white transition-all duration-150 ease-in-out border border-transparent bg-orange rounded-xl hover:bg-transparent hover:border-orange hover:text-orange'
                  onClick={handlePayment}
                >
                  Process Payment
                </button>
              )}
            </div>
          </div>
        </div>

        {cashPayment && (
          <div
            className='absolute z-50 p-5 bg-white w-[350px] rounded-xl space-y-1 flex flex-col'
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.3)',
            }}
          >
            <p className='h-5 text-sm text-center text-red-500 '>
              {/* {cashPaymentError?.message} */}
            </p>
            <div className='flex w-full gap-2 px-3 py-2 border-b border-orange'>
              <p className='flex-shrink-0 font-medium'>
                Cash <span>&#8369;</span> :
              </p>
              <input
                className='w-full bg-transparent outline-none no-spinner'
                type='number'
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
              />
            </div>

            <div className='flex gap-2 pt-3 ml-auto'>
              <button
                className='px-5 py-1 mx-auto border text-orange rounded-xl border-orange'
                onClick={toggleCashPayment}
              >
                Cancel
              </button>
              <button
                className='px-5 py-1 mx-auto text-white rounded-xl bg-orange'
                // onClick={postCashPayment}
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.getElementById('modal'),
  )
}
