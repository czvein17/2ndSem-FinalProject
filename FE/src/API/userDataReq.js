import http from './http'
import Cookies from 'js-cookie'

export const fetchAllUsers = async () => {
  console.log(Cookies.get('jwt'))
  const response = await http.get('/users')
  return response.data
}
