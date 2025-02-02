import { useContext } from 'react'
import { CartContext } from '../context/cartContext'

import React from 'react'

export const useCartContext = () => {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    throw new Error('useCartContext must be used within an CartContextProvider')
  }

  return cartContext
}
