import React, { useState } from 'react'

import { MdOutlineMail, MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import CUP_OF_CHI from '../assets/images/logo.svg'
import { useMutation } from '@tanstack/react-query'
import { resetPassword, sendOtp, verifyOtp } from '../API/auth'
import { useNavigate } from 'react-router-dom'

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus on next input
    if (element.nextSibling) {
      element.nextSibling.focus()
    }
  }

  const {
    mutate: sendOtpMutate,
    isPending: isSending,
    isError,
    error: sendOtpError,
  } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      console.log(data)
      setStep(2)
    },
  })

  const {
    mutate: verifyOtpMutate,
    isPending: isVerifyPending,
    isError: isVerifyError,
    error: verifyError,
  } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log(data)
      setStep(3)
    },
  })

  const { mutate: resetPasswordMutate } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const handleSendOtp = (e) => {
    e.preventDefault()
    sendOtpMutate(email)
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    verifyOtpMutate({ email, otp: otpValue })
  }

  const handleResetPassword = (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('Password does not match')
      return
    }

    const otpValue = otp.join('')

    resetPasswordMutate({ otp: otpValue, email, newPassword })
  }

  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen space-y-5 font-poppins'>
      {step === 1 && (
        <>
          <img src={CUP_OF_CHI} className='w-[250px]' />

          <h1 className='text-2xl font-semibold text-orange'>Reset your password</h1>
          <p className='w-[25%] text-center text-gray-500'>
            Forgot your password? No worries, then let’s submit password reset. It
            will be send to your email.
          </p>

          <form className='  w-[25%] mt-10' onSubmit={handleSendOtp}>
            <p className='h-5 text-sm font-medium text-center text-red-500'>
              {error || sendOtpError?.message}
            </p>

            <p className='mb-3 font-medium text-orange'>Email Address </p>

            <div className='flex items-center justify-center gap-3 px-5 py-3 border-2 rounded-full border-orange'>
              <MdOutlineMail size={24} className='text-orange' />
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full bg-transparent outline-none'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className='w-full py-3 mt-6 text-white rounded-full bg-orange'
              type='submit'
              disabled={isSending}
            >
              {isSending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <button
            className='flex items-center text-orange'
            onClick={() => navigate('/')}
          >
            <MdOutlineKeyboardArrowLeft size={28} />
            Back to login screen
          </button>
        </>
      )}

      {/* 2nd STEP */}
      {step === 2 && (
        <div
          className='w-[600px] bg-white rounded-xl p-10 space-y-5'
          style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.5)' }}
        >
          <img src={CUP_OF_CHI} className='w-[100px] ' />
          <div>
            <h1 className='text-xl font-bold text-orange'>Reset your password</h1>
            <p className='text-sm font-medium text-gray-500'>
              Enter your 6 digit OTP in order to reset
            </p>
          </div>

          <p className='h-5 text-sm font-medium text-red-500'>
            {error || verifyError?.message}
          </p>

          <form className='flex flex-col gap-5' onSubmit={handleVerifyOtp}>
            <div className='flex justify-center gap-2'>
              {otp.map((data, index) => {
                return (
                  <input
                    key={index}
                    type='number'
                    name='otp'
                    maxLength='1'
                    className='w-full h-24 p-3 text-3xl text-center border-2 rounded-xl text-orange border-orange no-spinner'
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onFocus={(e) => e.target.select()}
                  />
                )
              })}
            </div>

            <button
              className='w-full py-3 text-white rounded-full bg-orange'
              type='submit'
              disabled={isVerifyPending}
            >
              {isVerifyPending ? 'Verifying OTP...' : 'Verify OTP'}
            </button>

            <p className='mx-auto font-medium text-gray-500'>
              Didn't receive the OTP?{' '}
              <span className='cursor-pointer text-orange'>Resend OTP in 60s</span>
            </p>
          </form>
        </div>
      )}

      {/* 3rd STEP */}
      {step === 3 && (
        <div
          className='w-[600px] bg-white rounded-xl p-10 space-y-5'
          style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.5)' }}
        >
          <img src={CUP_OF_CHI} className='w-[100px] ' />
          <div>
            <h1 className='text-xl font-bold text-orange'>Reset your password</h1>
            <p className='text-sm font-medium text-gray-500'>
              Enter your new password
            </p>
          </div>

          <p className='h-5 text-sm font-medium text-red-500'>{error}</p>

          <form className='flex flex-col gap-6' onSubmit={handleResetPassword}>
            <div className='space-y-2'>
              <p className='font-medium text-orange'>New Password</p>
              <div className='flex items-center gap-2 px-3 py-2 bg-white border rounded-full border-orange'>
                <input
                  type='password'
                  className='w-full bg-transparent outline-none'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <p className='font-medium text-orange'>Confirm Password</p>
              <div className='flex items-center gap-2 px-3 py-2 bg-white border rounded-full border-orange'>
                <input
                  type='password'
                  className='w-full bg-transparent outline-none'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              className='w-full py-3 text-white rounded-full bg-orange'
              type='submit'
            >
              Reset Password
            </button>
          </form>

          <button
            className='flex items-center mx-auto my-auto text-orange'
            onClick={() => navigate('/')}
          >
            <MdOutlineKeyboardArrowLeft size={28} />
            Back to login screen
          </button>
        </div>
      )}
    </div>
  )
}
