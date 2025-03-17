// eslint-disable-next-line react/prop-types
export const Loading = ({ message }) => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full gap-2 '>
      <div className='flex flex-row gap-2'>
        <div className='w-4 h-4 rounded-full bg-orange animate-bounce' />
        <div className='w-4 h-4 rounded-full bg-orange animate-bounce [animation-delay:-.3s]' />
        <div className='w-4 h-4 rounded-full bg-orange animate-bounce [animation-delay:-.5s]' />
      </div>
      {message}
    </div>
  )
}
