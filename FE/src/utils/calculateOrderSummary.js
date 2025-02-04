export const calculateOrderSummary = (orderItems, taxRate = 0.1) => {
  const subTotal = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )
  const tax = subTotal * taxRate
  const totalAmount = subTotal + tax
  return {
    subTotal,
    tax,
    totalAmount,
  }
}
