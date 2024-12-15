// axiosInstance.js
import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

import Cookies from 'js-cookie'

export const queryClient = new QueryClient()

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${Cookies.get('jwt')}`,
  },
  withCredentials: true,
})

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Format the error
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
