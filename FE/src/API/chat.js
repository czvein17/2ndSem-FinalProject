import http from './http'

export const sendChatToBot = async (message = 'This is a test') => {
  const response = await http.post('/chat', { message })
  //   console.log(response.data)
  return response.data
}
