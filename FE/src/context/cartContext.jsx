import React, { createContext, useState, useContext, useEffect } from 'react'

export const CartContext = createContext()

// Create a provider component
export const CartProvider = ({ children }) => {
  const [isDiscountApplicable, setIsDiscountApplicable] = useState(false)
  const [taxRate, setTaxRate] = useState(0.1) // 10%
  const [discountRate, setDiscountRate] = useState(0.05) // 5%
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  })

  useEffect(() => {
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    )
    const discount = isDiscountApplicable ? subtotal * discountRate : 0
    const tax = subtotal * taxRate
    const total = subtotal + tax

    setCart((prevCart) => ({ ...prevCart, subtotal, tax, total, discount }))
  }, [cart.items, taxRate, discountRate, isDiscountApplicable])

  console.log(cart.items)

  // Function to add an item to the cart
  const addToCart = (item, size) => {
    console.log(size)
    setCart((prevCart) => {
      const existingItem = prevCart.items.find(
        (cartItem) => cartItem._id === item._id,
      )

      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem,
          ),
        }
      } else {
        return {
          ...prevCart,
          items: [...prevCart.items, { ...item, quantity: 1, size: size }],
        }
      }
    })
  }

  // Function to remove an item from the cart
  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((cartItem) => cartItem._id === itemId)

      if (!existingItem) return prevCart

      if (existingItem.quantity > 1) {
        return {
          ...prevCart,
          items: prevCart.items.map((cartItem) =>
            cartItem._id === itemId
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem,
          ),
        }
      } else {
        return {
          ...prevCart,
          items: prevCart.items.filter((item) => item._id !== itemId),
        }
      }
    })
  }

  const applyDiscount = () => {
    setCart((prevCart) => {
      const discount = prevCart.total * discountRate
      return {
        ...prevCart,
        total: prevCart.total - discount,
      }
    })
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, applyDiscount }}>
      {children}
    </CartContext.Provider>
  )
}
