import http from './http'

export const recommendProduct = async (emotion) => {
  console.log(emotion)
  const mood = emotion.join(', ')
  const response = await http.post('/products', { mood })
  return response.data
}
