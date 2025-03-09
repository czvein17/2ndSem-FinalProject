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
