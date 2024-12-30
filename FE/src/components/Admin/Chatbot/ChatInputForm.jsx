import React, { memo } from 'react'
import { LuSend } from 'react-icons/lu'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export const ChatInputForm = memo(({ handleSubmit, value, setValue, isSending }) => {
  console.log('ChatInputForm Rendered')
  return (
    <form
      onSubmit={handleSubmit}
      className='flex gap-5 bg-secondary py-2 px-4  rounded-xl justify-center items-center'
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Type your message... HERE'
        className='w-full bg-transparent outline-none py-2 text-sm overflow-hidden resize-none '
      />
      <button
        type='submit'
        className='bg-accent p-3 rounded-lg'
        title='Send'
        disabled={isSending}
      >
        <span className='text-white flex justify-center items-center gap-2'>
          {isSending ? (
            <span className='text-white animate-spin'>
              <AiOutlineLoading3Quarters size={20} />
            </span>
          ) : (
            <LuSend size={20} />
          )}
        </span>
      </button>
    </form>
  )
})
