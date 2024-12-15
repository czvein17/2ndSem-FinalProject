// eslint-disable-next-line react/prop-types
const Loading = ({ message }) => {
  return (
    <div className='w-full h-full flex flex-col gap-2 justify-center items-center  '>
      <div className='flex flex-row gap-2'>
        <div className='w-4 h-4 rounded-full bg-accent animate-bounce' />
        <div className='w-4 h-4 rounded-full bg-accent animate-bounce [animation-delay:-.3s]' />
        <div className='w-4 h-4 rounded-full bg-accent animate-bounce [animation-delay:-.5s]' />
      </div>
      {message}
    </div>
  )
}

export default Loading
