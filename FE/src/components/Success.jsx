import React, { useEffect } from 'react'
import axios from 'axios'

import { confirmPayment } from '../API/payment'

export const Success = () => {
  useEffect(() => {
    const confirmPayment = async () => {
      const params = new URLSearchParams(location.search)
      const checkoutId = params.get('id')

      try {
        const response = await confirmPayment(checkoutId)
        console.log('Payment confirmed:', response.data)
      } catch (error) {
        console.error('Error confirming payment:', error)
      }
    }

    confirmPayment()
  }, [location])
  return <div>Success</div>
}
