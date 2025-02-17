import http from './http'

export const createOrder = async (payload) => {
  console.log('Payload ', payload)

  const order = await http.post('/orders', payload)
  return order.data
}

export const getAllOrders = async () => {
  const orders = await http.get('orders')
  return orders.data
}

export const getOrder = async (orderId) => {
  const order = await http.get(`/orders/${orderId}`)
  return order.data
}
