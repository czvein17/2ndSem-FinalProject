import http from './http'

export const payWithPayMaya = async (order) => {
  const orderId = order.d._id
  const response = await http.post(`/payment/maya/${orderId}`)
  return response.data
}

export const confirmPayment = async (orderId) => {
  const response = await http.get(`/payment/maya-confirm/${orderId}`)
  return response.data
}
