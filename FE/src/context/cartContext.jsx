import React, { createContext, useState, useContext, useEffect } from 'react'
import io from 'socket.io-client'

export const CartContext = createContext()
const socket = io(`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}`)

// Create a provider component
export const CartProvider = ({ children }) => {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0)

  const [isDiscountApplicable, setIsDiscountApplicable] = useState(false)
  const [taxRate, setTaxRate] = useState(0.12) // 12%
  const [cart, setCart] = useState(() => {
    // Load cart data from localStorage if available
    const savedCart = localStorage.getItem('cart')
    return savedCart
      ? JSON.parse(savedCart)
      : {
          discountType: '',
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          discount: 0,
        }
  })

  useEffect(() => {
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.prices[item.size] * item.quantity,
      0,
    )
    const discount = isDiscountApplicable ? subtotal * cart.discount : 0
    const tax = parseFloat((subtotal * taxRate).toFixed(2))
    const total = parseFloat((subtotal + tax - discount).toFixed(2))

    setCart((prevCart) => ({ ...prevCart, subtotal, tax, total, discount }))
  }, [cart.items, taxRate, isDiscountApplicable])

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    console.log('Setting up WebSocket listener for pendingOrdersCount')
    socket.on('pendingOrdersCount', (count) => {
      setPendingOrdersCount(count)
    })

    return () => {
      console.log('Cleaning up WebSocket listener for pendingOrdersCount')
      socket.off('pendingOrdersCount')
    }
  }, [])

  // Function to add an item to the cart
  const addToCart = (item, size) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (cartItem) => cartItem._id === item._id && cartItem.size === size,
      )

      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map((cartItem) =>
            cartItem._id === item._id && cartItem.size === size
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem,
          ),
        }
      } else {
        return {
          ...prevCart,
          items: [
            ...prevCart.items,
            { ...item, quantity: 1, size: size, prices: item.prices },
          ],
        }
      }
    })
  }

  // Function to remove an item from the cart
  const removeFromCart = (itemId, size) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (cartItem) => cartItem._id === itemId && cartItem.size === size,
      )

      if (!existingItem) return prevCart

      if (existingItem.quantity > 1) {
        return {
          ...prevCart,
          items: prevCart.items.map((cartItem) =>
            cartItem._id === itemId && cartItem.size === size
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem,
          ),
        }
      } else {
        return {
          ...prevCart,
          items: prevCart.items.filter(
            (item) => item._id !== itemId || item.size !== size,
          ),
        }
      }
    })
  }

  const applyDiscount = (discountType) => {
    setCart((prevCart) => {
      let discount = 0
      if (discountType === 'pwd' || discountType === 'senior') {
        discount = prevCart.subtotal * 0.2 // 20% discount
      } else if (discountType === 'promo') {
        discount = prevCart.subtotal * 0.1 // 10% discount
      }

      const total = parseFloat(
        (prevCart.subtotal + prevCart.tax - discount).toFixed(2),
      )

      return {
        ...prevCart,
        discountType,
        discount,
        total,
      }
    })
  }

  const clearCart = () => {
    setCart({
      discountType: '',
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        pendingOrdersCount,
        addToCart,
        removeFromCart,
        applyDiscount,
        clearCart,
        setIsDiscountApplicable,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
