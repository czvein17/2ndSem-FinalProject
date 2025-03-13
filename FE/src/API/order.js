import http from './http'

export const createOrder = async (payload) => {
  console.log('Payload ', payload)

  const order = await http.post('/orders', payload)
  return order.data
}

export const getAllOrders = async (queryParams = {}) => {
  const orders = await http.get('orders', { params: queryParams })
  return orders.data
}

export const getOrder = async (orderId) => {
  console.log('Order Id ', orderId)
  const order = await http.get(`/orders/${orderId}`)
  return order.data
}

export const updateOrderStatus = async ({ orderId, status }) => {
  console.log('Order Id ', orderId)
  console.log('Status ', status)
  const order = await http.patch(`/orders/${orderId}`, { status })
  return order.data
}

export const deleteOrder = async (orderId) => {
  const order = await http.delete(`/orders/${orderId}`)
  return order.data
}
