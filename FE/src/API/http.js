// axiosInstance.js
import { QueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import axios from 'axios'

export const queryClient = new QueryClient()

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

http.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Format the error
    console.log(error)
    const formattedError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred',
      status: error.response?.status,
      headers: error.response?.headers,
    }

    return Promise.reject(formattedError)
  },
)

export default http
