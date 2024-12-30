import http from './http'

export const sendChatToBot = async ({ message, conversationId }) => {
  const response = await http.post('/chat', { message, conversationId })
  return response.data
}

export const getChatHistory = async () => {
  const response = await http.get('/chat')
  return response.data
}

export const getConversationById = async (id) => {
  const response = await http.get(`/chat/${id}`)
  return response.data
}

export const deleteConversationById = async (id) => {
  const response = await http.delete(`/chat/${id}`)
  return response.data
}
