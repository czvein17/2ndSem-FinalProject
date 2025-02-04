import { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { ModalWrapper } from '../ModalWrapper'
import { SlClose } from 'react-icons/sl'

import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from '../../API/order'
import { calculateOrderSummary } from '../../utils/calculateOrderSummary'

export const PaymentModal = () => {
  // const paymentModalRef = useRef()
  const location = useLocation()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const navigate = useNavigate()

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

  // const orderSummary = order.d.orderItems ? calculateOrderSummary()
  const orderSummary = order
    ? calculateOrderSummary(order.d.orderItems)
    : { subTotal: 0, tax: 0, total: 0 }

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setOrderId(null)
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete('order')
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  if (!isPaymentModalOpen) return null

  return ReactDOM.createPortal(
    <div className='fixed top-0 left-0 w-[100%] h-[100%] bg-[#00000090] flex justify-center items-center'>
      <div className='relative w-full  mx-5 bg-background rounded-xl md:w-auto lg:w-[800px] lg:h-[800px] flex flex-col'>
        {!isPending && !isError && order && (
          <>
            <div className='relative px-5 py-3 font-medium text-white bg-orange rounded-t-xl'>
              <h1 className='text-xl uppercase'>Payment</h1>

              <button
                className='absolute top-2 right-2 rounded-tr-xl '
                onClick={closePaymentModal}
              >
                <SlClose size={24} />
              </button>
            </div>
            {/* THIS SHOULD NOT OVERLAP TO THE PARENT DIV */}
            <div className='flex w-full h-full p-5 overflow-hidden'>
              <div className='w-full h-full p-2 space-y-4 overflow-auto'>
                {order.d.orderItems.map((item) => (
                  <div
                    key={item.product._id}
                    className='bg-secondBg h-[100px] rounded-xl flex space-x-2 p-2'
                    style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.5)' }}
                  >
                    {/* {console.log(item)} */}

                    <div className='w-20 h-20 my-auto'>
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${item.product.image}`}
                        alt={item.product.image}
                        className='object-contain w-full h-full rounded-xl'
                      />
                    </div>

                    <div>
                      <h1>{item.product.name}</h1>
                      <h1>QTY: {item.quantity}</h1>
                      <h1>PRICE: {item.price}</h1>
                    </div>
                  </div>
                ))}
              </div>
              <div className='w-full'>
                <div className='flex justify-between'>
                  <h2>Sub Total</h2>
                  <h2>${orderSummary.subTotal.toFixed(2)}</h2>
                </div>

                <div className='flex justify-between'>
                  <h2>Tax</h2>
                  <h2>${orderSummary.tax.toFixed(2)}</h2>
                </div>

                <div className='flex justify-between'>
                  <h2>Total</h2>
                  <h2>${orderSummary.totalAmount.toFixed(2)}</h2>
                </div>

                <div className='flex justify-between'>
                  <h2>Discount</h2>
                  <h2>{}</h2>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.getElementById('modal'),
  )

  // return (
  //   <ModalWrapper ref={paymentModalRef}>
  //     {!isPending && !isError && order && (
  //       <div className='m-2 w-[600px]'>
  //         <h1>Order ID : {order.d._id}</h1>
  //         {/* <h1>Order ID : {order.d._id}</h1> */}
  //       </div>
  //     )}
  //   </ModalWrapper>
  // )
}
