import React, { createContext, useState, useContext, useEffect } from 'react'

export const CartContext = createContext()

// Create a provider component
export const CartProvider = ({ children }) => {
  const [isDiscountApplicable, setIsDiscountApplicable] = useState(false)
  const [taxRate, setTaxRate] = useState(0.12) // 12%
  // const [discountRate, setDiscountRate] = useState(0.05) // 5%
  const [cart, setCart] = useState({
    discountType: '',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    discount: 0,
  })

  useEffect(() => {
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    )
    const discount = isDiscountApplicable ? subtotal * cart.discount : 0
    const tax = parseFloat((subtotal * taxRate).toFixed(2))
    const total = parseFloat((subtotal + tax - discount).toFixed(2))

    setCart((prevCart) => ({ ...prevCart, subtotal, tax, total, discount }))
  }, [cart.items, taxRate, isDiscountApplicable])

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
