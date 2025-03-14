import googleIcon from '../../assets/icons/google.svg'

export const GoogleLoginButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='flex items-center justify-center w-full gap-3 p-4 font-semibold duration-100 ease-in-out border rounded-lg border-orange hover:bg-orange hover:bg-opacity-50 hover:text-[#322f30] border-opacity-50'
    >
      <img src={googleIcon} alt='google' className='w-[24px]' />
      <span>Login with Google</span>
    </button>
  )
}
