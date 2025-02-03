import React, { useEffect, useState, useRef } from 'react'
import { ModalWrapper } from '../ModalWrapper'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from '../../API/order'

export const PaymentModal = () => {
  const paymentModalRef = useRef()
  const location = useLocation()
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const orderId = searchParams.get('order')
    if (orderId) {
      setOrderId(orderId)
      paymentModalRef.current.openModal()
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

  return (
    <ModalWrapper ref={paymentModalRef}>
      {!isPending && !isError && order && (
        <div className='m-2 w-[600px]'>
          <h1>Order ID : {order.d._id}</h1>
          <h1>Order ID : {order.d._id}</h1>
        </div>
      )}
    </ModalWrapper>
  )
}
