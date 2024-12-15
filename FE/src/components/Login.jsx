import { useEffect, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'

import { loginViaEmailAndPassword, loginViaGoogle } from '../API/login'

import facebook from '../assets/icons/facebook.svg'
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
    <div className='flex flex-col-reverse md:flex-row items-center justify-center h-screen font-inter'>
      <div className='md:w-1/2 p-5 md:p-10 md:m-10 h-full flex flex-col justify-center'>
        <h1 className='text-3xl font-bold'>LOGIN</h1>
        <p className='pt-3 text-[16px]'>Please login to continue</p>

        <form className='flex flex-col gap-8 pt-10 ' onSubmit={handleLogin}>
          <div>
            <p className='text-red-600 h-5'>{error}</p>
            <p className='font-bold'>Email : </p>
            <div className='bg-white rounded-md py-2 mt-3'>
              <input
                placeholder='Enter email'
                className='border p-2 w-full outline-none bg-transparent border-none text-[16px]'
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </div>
          </div>

          <div>
            <p className='font-bold'>Password : </p>
            <div className='bg-white rounded-md py-2 mt-3 relative'>
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
            className='bg-black text-white p-5 rounded-lg font-bold'
          >
            {isLoginViaEmailPending || isLoginViaGooglePending
              ? 'Loading...'
              : 'Login'}
          </button>
        </form>

        <div className='flex items-center justify-center pt-10'>
          <div className='border-t border-black flex-grow mr-3'></div>
          <span className='text-black text-lg '>or</span>
          <div className='border-t border-black flex-grow ml-3'></div>
        </div>

        <div className='flex justify-center gap-10 pt-10'>
          <button className='p-5 flex gap-3 justify-center items-center border border-black rounded-lg font-semibold w-full hover:bg-black hover:text-white ease-in-out duration-100'>
            <img src={facebook} alt='facebook' className='w-[24px]' />
            <span>Login with Facebook</span>
          </button>

          <GoogleLoginButton onClick={() => googleLogin()} />
        </div>

        <p className='text-center pt-10'>
          Don&apos;t have an account ?{' '}
          <span className='text-black font-semibold cursor-pointer'>Sign Up</span>
        </p>
      </div>
      <div className='w-full md:w-1/2 bg-black md:h-full'>1</div>
    </div>
  )
}

export default Login
