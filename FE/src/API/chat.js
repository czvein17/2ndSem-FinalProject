import http from './http'

export const sendChatToBot = async ({ message, conversationId }) => {
  console.log({ message, conversationId })
  const response = await http.post('/chat', { message, conversationId })
  //   console.log(response.data)
  return response.data
}

export const getChatHistory = async () => {
  const response = await http.get('/chat')
  console.log(response.data)
  return response.data
}

export const getConversationById = async (id) => {
  const response = await http.get(`/chat/${id}`)
  return response.data
}
