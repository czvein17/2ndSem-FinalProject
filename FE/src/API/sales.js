import http from './http'

export const getProductSales = async (productId) => {
  const productSales = await http.get(`/sales/product/${productId}`)
  console.log(productSales.data)
  return productSales.data
}

export const getBestSellingProducts = async () => {
  const bestSellingProducts = await http.get('/sales/best-preferred-products')
  return bestSellingProducts.data
}
