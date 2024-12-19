import http from './http'
import Cookies from 'js-cookie'

export const fetchAllUsers = async () => {
  const response = await http.get('/users')
  return response.data
}

export const updateUser = async (userId) => {
  const response = await http.patch(`/users/${userId}`)
  return response.data
}

export const deleteUser = async (userId) => {
  const response = await http.delete(`/users/${userId}`)
  return response.data
}
