import http from './http'

export const recommendProduct = async (emotion) => {
  console.log(emotion)
  const mood = emotion.join(', ')
  const response = await http.post('/products', { mood })
  return response.data
}

export const getAllProducts = async (queryParams = {}) => {
  const coffees = await http.get('/products', { params: queryParams })
  console.log(coffees.data)
  return coffees.data
}

export const getProductById = async (id) => {
  const coffee = await http.get(`/products/${id}`)
  console.log(coffee.data)
  return coffee.data
}
