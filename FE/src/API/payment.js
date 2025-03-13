import http from './http'

export const payWithCash = async ({ orderId, receiveAmount }) => {
  console.log('orderId', orderId)
  console.log('receiveAmount', receiveAmount)
  const response = await http.post(`/payment/cash/${orderId}`, { receiveAmount })
  return response.data
}

export const payWithPayMaya = async (order) => {
  const orderId = order.d._id
  const response = await http.post(`/payment/maya/${orderId}`)
  return response.data
}

export const confirmPayment = async (orderId) => {
  const response = await http.get(`/payment/maya-confirm/${orderId}`)
  return response.data
}
