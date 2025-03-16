import http from './http'

export const getAllSales = async (queryParams = {}) => {
  const sales = await http.get('/sales', { params: queryParams })
  console.log(sales.data)
  return sales.data
}

export const getProductSales = async (productId) => {
  const productSales = await http.get(`/sales/product/${productId}`)
  console.log(productSales.data)
  return productSales.data
}

export const getBestSellingProducts = async () => {
  const bestSellingProducts = await http.get('/sales/best-preferred-products')
  return bestSellingProducts.data
}

export const getTotalPurchase = async () => {
  const totalPurchase = await http.get('/sales/total-purchase')
  return totalPurchase.data
}

export const getTotalSales = async () => {
  const totalSales = await http.get('/sales/total-sales')
  return totalSales.data
}

export const getSalesData = async (timeRange) => {
  const salesData = await http.get('/sales/sales-data', {
    params: { timeRange },
  })
  return salesData.data
}

export const getSalesByStatus = async () => {
  const salesByStatus = await http.get('/sales/sales-by-status')
  return salesByStatus.data
}
