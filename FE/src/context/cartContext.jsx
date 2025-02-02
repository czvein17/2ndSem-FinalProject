import React, { createContext, useState, useContext, useEffect } from 'react'

export const CartContext = createContext()

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
  })

  useEffect(() => {
    const total = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    )
    setCart((prevCart) => ({ ...prevCart, total }))
  }, [cart.items])

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

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}
