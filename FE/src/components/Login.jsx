import { useEffect, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'

import { loginViaEmailAndPassword, loginViaGoogle } from '../API/login'

import facebook from '../assets/icons/facebook.svg'
import CUP_OF_CHI from '../assets/images/logo.svg'

import { FaEye } from 'react-icons/fa6'
import { FaEyeSlash } from 'react-icons/fa6'
import { GoogleLoginButton } from './button/GoogleLoginButton'
import { useAuth } from '../hooks/useAuth'
import { useMutation } from '@tanstack/react-query'

const Login = () => {
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState({
    username: '',
    password: '',
  })

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => loginUsingGoogle(codeResponse),
    onError: (error) => console.log('Login Failed:', error),
  })

  const {
    mutateAsync: loginUsingEmailAndPassword,
    isPending: isLoginViaEmailPending,
  } = useMutation({
    mutationFn: loginViaEmailAndPassword,
    onSuccess: (user) => login(user),
    onError: (error) => setError(error.message),
  })

  const { mutateAsync: loginUsingGoogle, isPending: isLoginViaGooglePending } =
    useMutation({
      mutationFn: loginViaGoogle,
      onSuccess: (user) => login(user),
      onError: (error) => setError(error.message),
    })

  function showAndHidePassword(e) {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  async function handleLogin(e) {
    e.preventDefault()

    if (data.username === '' || data.password === '') {
      return setError('Please fill all the fields')
    }

    loginUsingEmailAndPassword({
      email: data.username,
      password: data.password,
    })
  }

  useEffect(() => {
    if (!error) return

    setTimeout(() => {
      setError('')
    }, 5000)
  }, [error])

  return (
    <div className='flex flex-col-reverse items-center justify-center h-screen md:flex-row font-inter'>
      <div className='flex flex-col justify-center h-full p-5 md:w-1/2 md:p-10 md:m-10'>
        <div className='w-64 h-64 mx-auto'>
          <img src={CUP_OF_CHI} alt='Facebook Logo' className='object-contain' />
        </div>

        <h1 className='text-3xl font-bold'>LOGIN</h1>
        <p className='pt-3 text-[16px]'>Please login to continue</p>

        <form className='flex flex-col gap-8 pt-10 ' onSubmit={handleLogin}>
          <div>
            <p className='h-5 text-red-600'>{error}</p>
            <p className='text-base font-bold'>Email : </p>
            <div className='py-1 mt-3 rounded-md shadow-lg bg-secondary'>
              <input
                placeholder='Enter email'
                className='w-full p-2 text-base bg-transparent border border-none outline-none'
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <p className='font-bold'>Password : </p>
            <div className='relative py-2 mt-3 rounded-md bg-secondary'>
              {!showPassword ? (
                <input
                  type='password'
                  value={data.password}
                  placeholder='Enter password'
                  className='border p-2 w-full outline-none bg-transparent border-none text-[16px]'
                  style={{
                    fontWeight: data.password ? 'bold' : 'normal',
                  }}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              ) : (
                <input
                  type='text'
                  value={data.password}
                  placeholder='Enter password'
                  className='border p-2 w-full outline-none bg-transparent border-none text-[16px]'
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              )}
              <button
                onClick={showAndHidePassword}
                className='absolute top-2 right-5 bottom-2'
              >
                {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
              </button>
            </div>

            <div className='flex justify-between pt-3 mx-1'>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='rememberMe'
                  className="peer mr-2 appearance-none h-4 w-4 border border-black rounded-sm checked:bg-black checked:border-black checked:after:content-[''] checked:after:block checked:after:w-full checked:after:h-full checked:after:bg-white checked:after:clip-path-checkmark"
                />
                <label htmlFor='rememberMe' className='peer-checked:text-black'>
                  Remember Me
                </label>
              </div>
              <button type='button' onClick={() => console.log('hello world')}>
                Forgot Password
              </button>
            </div>
          </div>

          <button
            type='submit'
            className='p-5 font-bold text-white bg-black rounded-lg'
          >
            {isLoginViaEmailPending || isLoginViaGooglePending
              ? 'Loading...'
              : 'Login'}
          </button>
        </form>

        <div className='flex items-center justify-center pt-10'>
          <div className='flex-grow mr-3 border-t border-black'></div>
          <span className='text-lg text-black '>or</span>
          <div className='flex-grow ml-3 border-t border-black'></div>
        </div>

        <div className='flex justify-center gap-10 pt-10'>
          <GoogleLoginButton onClick={() => googleLogin()} />
        </div>

        <p className='pt-10 text-center'>
          Don&apos;t have an account ?{' '}
          <span className='font-semibold text-black cursor-pointer'>Sign Up</span>
        </p>
      </div>
      <div className='flex w-full p-5 md:w-1/2 md:h-full'>
        <img src={CUP_OF_CHI} alt='Cup of Chi Logo' className='object-contain' />
      </div>
    </div>
  )
}

export default Login
