import React, { useEffect } from 'react'
import axios from 'axios'

import { confirmPayment } from '../API/payment'
import { useQuery } from '@tanstack/react-query'

export const Success = () => {
  const {
    data: paymentDetails,
    isPending,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['confirmPayment'],
    queryFn: confirmPayment,
  })

  useEffect(() => {
    const confirmPaymentAndCreateSales = async () => {
      const params = new URLSearchParams(location.search)
      const orderId = params.get('order')

      paymentDetails(orderId)
    }

    confirmPaymentAndCreateSales()
  }, [location])
  return <div>Success</div>
}
