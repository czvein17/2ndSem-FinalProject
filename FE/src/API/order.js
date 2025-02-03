import http from './http'

export const createOrder = async (cartItems) => {
  const payload = {
    orderItems: cartItems,
  }

  const order = await http.post('/orders', payload)
  return order.data
}

export const getOrder = async (orderId) => {
  const order = await http.get(`/orders/${orderId}`)
  return order.data
}
