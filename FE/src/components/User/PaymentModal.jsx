import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom'

import { useMutation, useQuery } from '@tanstack/react-query'
import { getOrder } from '../../API/order'

import { SlClose } from 'react-icons/sl'
import CUP_OF_CHI from '../../assets/images/logo.svg'
import CashLogo from '../../assets/icons/cash-logo.svg'
import MayaLogo from '../../assets/icons/maya-logo.svg'
import PAYMENT_SUCCESS from '../../assets/images/payment_success.gif'

import { OrderSummaryCards } from './Cards/OrderSummaryCards'
import { PaymentOrderItemsCard } from './Cards/PaymentOrderItemsCard'
import { payWithPayMaya } from '../../API/payment'

// Utility function to detect if running in Electron
const isElectron = () => {
  return (
    typeof window !== 'undefined' &&
    window.process &&
    window.process.type === 'renderer'
  )
}

export const PaymentModal = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [orderId, setOrderId] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [castMode, setCashMode] = useState(false)

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
    staleTime: 0, // Data is considered stale immediately
    cacheTime: 0, // Data is not cached
  })

  const { mutate: handlePaymayaPayment } = useMutation({
    mutationFn: () => payWithPayMaya(order),
    onSuccess: (data) => {
      if (isElectron()) {
        // Handle redirection in Electron
        const { shell } = require('electron')
        shell.openExternal(data.d.redirectUrl)
      } else {
        // Handle redirection in a web browser
        window.location.href = data.d.redirectUrl
      }
    },
  })

  const handleCashPayment = () => setCashMode(!castMode)

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
      onClick: handleCashPayment,
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
        {/* <div className='absolute z-50 bg-black bottom-50'>CASH</div>
         */}

        {castMode && (
          <div
            className='absolute z-50 p-5 bg-white w-[350px] rounded-xl space-y-4 flex flex-col'
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div className='flex w-full gap-2 px-3 py-2 border-b border-orange'>
              <p className='flex-shrink-0 font-medium'>
                Cash <span>&#8369;</span> :
              </p>
              <input
                className='w-full bg-transparent outline-none no-spinner'
                type='number'
              />
            </div>

            <div className='flex gap-2 ml-auto'>
              <button
                className='px-5 py-1 mx-auto border text-orange rounded-xl border-orange'
                onClick={handleCashPayment}
              >
                Cancel
              </button>
              <button className='px-5 py-1 mx-auto text-white rounded-xl bg-orange'>
                Pay Now
              </button>
            </div>
          </div>
        )}
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

              <div className='flex flex-col justify-between w-full h-full '>
                {/* ORDER SUMMARY */}
                <div className='flex flex-col p-5 space-y-5 rounded-xl'>
                  <div className='w-full h-28 '>
                    <img
                      src={CUP_OF_CHI}
                      alt=''
                      className='object-contain w-full h-full'
                    />
                  </div>

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
                {order.d.sales && order.d.sales.paymentStatus === 'paid' ? (
                  <div className='flex flex-col h-full mx-auto space-y-2 '>
                    <div className='w-full h-40'>
                      <img
                        src={PAYMENT_SUCCESS}
                        alt='Payment Success'
                        className='object-contain w-full h-full'
                      />
                    </div>
                    <h1 className='text-xl font-medium text-center'>
                      Payment Success
                    </h1>

                    <button
                      className='py-2 text-white bg-orange rounded-xl'
                      onClick={closePaymentModal}
                    >
                      Close
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.getElementById('modal'),
  )
}
