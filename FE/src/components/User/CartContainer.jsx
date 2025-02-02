import React from 'react'
import { useCartContext } from '../../hooks/useCartContext'

export const CartContainer = () => {
  const { cart } = useCartContext()
  return (
    <div className='w-[500px] border-l-2 bg-white px-5 py-10'>
      <h1 className='text-2xl font-medium'>Cart</h1>
      <p>{cart.total}</p>
    </div>
  )
}
