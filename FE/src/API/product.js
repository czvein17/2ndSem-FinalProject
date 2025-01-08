import http from './http'

export const recommendProduct = async (emotion) => {
  console.log(emotion)
  const mood = emotion.join(', ')
  const response = await http.post('/products', { mood })
  return response.data
}

export const getAllProducts = async () => {
  const coffees = await http.get('/products')
  console.log(coffees)
  return coffees.data
}
