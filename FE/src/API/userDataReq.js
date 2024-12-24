import http from './http'
import Cookies from 'js-cookie'

export const fetchAllUsers = async (queryParams = {}) => {
  const response = await http.get('/users', { params: queryParams })
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
