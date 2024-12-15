import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

export const checkAuth = () => {
  const token = Cookies.get('jwt')

  if (!token) return false

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
  } catch (error) {
    console.log(error)
    return false
  }
}
