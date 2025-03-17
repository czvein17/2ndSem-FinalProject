import http from './http'

export const sendOtp = async (email) => {
  console.log(email)
  const response = await http.post('/auth/send-otp', { email })
  return response.data
}

export const verifyOtp = async ({ email, otp }) => {
  const response = await http.post(`/auth/verify-otp/${otp}`, { email })
  return response.data
}

export const resetPassword = async ({ otp, email, newPassword }) => {
  const response = await http.post(`/auth/reset-password/${otp}`, {
    email,
    newPassword,
  })
  return response.data
}
