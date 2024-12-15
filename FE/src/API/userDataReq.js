import http from './http'
import Cookies from 'js-cookie'

export const fetchAllUsers = async () => {
  const response = await http.get('/users')
  return response.data
}
