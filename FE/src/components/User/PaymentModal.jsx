import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom'

import { useMutation, useQuery } from '@tanstack/react-query'
import { getOrder } from '../../API/order'

import { SlClose } from 'react-icons/sl'
import CashLogo from '../../assets/icons/cash-logo.svg'
import MayaLogo from '../../assets/icons/maya-logo.svg'

import { OrderSummaryCards } from './Cards/OrderSummaryCards'
import { PaymentOrderItemsCard } from './Cards/PaymentOrderItemsCard'
import { payWithPayMaya } from '../../API/payment'

export const PaymentModal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const orderId = searchParams.get('order')
    if (orderId) {
      setOrderId(orderId)
      setIsPaymentModalOpen(true)
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
    enabled: !!orderId,
  })

  const { mutate: handlePaymayaPayment } = useMutation({
    mutationFn: () => payWithPayMaya(order),
    onSuccess: (data) => {
      window.location.href = data.d.redirectUrl
    },
  })

  const orderSummary = [
    {
      title: 'Sub-Total',
      value: order?.d?.subTotal,
    },
    {
      title: 'Tax',
      value: order?.d?.tax,
    },

    {
      title: 'Discount',
      value: order?.d?.discountAmount,
    },
    {
      title: 'Discount Type',
      value: order?.d?.discountType,
    },
    {
      title: 'Total',
      value: order?.d?.totalAmount,
    },

    // {
    //   title: 'Total',
    //   value: order?.d?.checkoutId,
    // },
  ]

  const paymentOptions = [
    {
      title: 'Cash',
      icon: CashLogo,
    },
    {
      title: 'PayMaya',
      icon: MayaLogo,
      onClick: handlePaymayaPayment,
    },
  ]

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setOrderId(null)
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete('order')
    navigate(`${location.pathname}?${searchParams.toString()}`)
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

  if (!isPaymentModalOpen) return null

  return ReactDOM.createPortal(
    <div className='fixed top-0 left-0 w-[100%] h-[100%] bg-[#00000090] flex justify-center items-center'>
      <div className='relative w-full  mx-5 bg-background rounded-xl md:w-auto lg:w-[800px] lg:h-[800px] flex flex-col font-poppins'>
        {!isPending && !isError && order && (
          <>
            <div className='relative px-5 py-2 font-medium text-white bg-orange rounded-t-xl'>
              <h1 className='text-xl font-medium text-center'>Payment</h1>

              <button
                className='absolute top-2 right-2 rounded-tr-xl '
                onClick={closePaymentModal}
              >
                <SlClose size={24} />
              </button>
            </div>
            {/* THIS SHOULD NOT OVERLAP TO THE PARENT DIV */}

            <div className='flex justify-between w-full h-full p-5 overflow-hidden'>
              <div className='w-full h-full p-2 space-y-4 overflow-auto'>
                {order.d.orderItems.map((item) => (
                  <PaymentOrderItemsCard key={item.product._id} item={item} />
                ))}
              </div>

              <div className='w-1 h-full mx-3 bg-[#D9D9D9] rounded-full' />

              <div className='flex flex-col justify-between w-full'>
                {/* ORDER SUMMARY */}
                <div className='flex flex-col p-5 space-y-8 rounded-xl'>
                  <h1
                    className='mx-auto text-5xl font-medium'
                    style={{ textShadow: '1px 1px 10px rgba(0, 0, 0, 0.5)' }}
                  >
                    <span className='text-orange'>Chi'</span>
                    Coffee
                  </h1>

                  <div className='uppercase'>
                    <h1 className='font-medium'>
                      Order ID: <span className='text-orange'>{order.d._id}</span>
                    </h1>
                    <h1 className='font-medium'>
                      Created At:{' '}
                      <span className='text-orange'>
                        {formatDate(order.d.createdAt)}{' '}
                        {formatTime(order.d.createdAt)}
                      </span>
                    </h1>
                  </div>

                  <div className='space-y-2'>
                    {orderSummary.map((summary, index) => (
                      <OrderSummaryCards key={index} orderSummary={summary} />
                    ))}
                  </div>
                </div>
                {/* PAYMENT OPTION */}
                <div className='space-y-2'>
                  <h1 className='font-medium'>Payment Option :</h1>
                  <div className='flex gap-2'>
                    {paymentOptions.map((option, index) => (
                      <button
                        key={index}
                        className='flex items-center justify-center p-2 transition-transform duration-150 ease-in-out border-2 border-orange rounded-xl hover:scale-105'
                        onClick={option.onClick}
                      >
                        <img
                          className='h-10 my-auto max-w-20'
                          src={option.icon}
                          alt={option.title}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.getElementById('modal'),
  )
}
