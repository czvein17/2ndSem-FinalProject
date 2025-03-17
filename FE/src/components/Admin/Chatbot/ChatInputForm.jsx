import React, { memo } from 'react'
import { LuSend } from 'react-icons/lu'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export const ChatInputForm = memo(({ handleSubmit, value, setValue, isSending }) => {
  console.log('ChatInputForm Rendered')
  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-center justify-center gap-5 px-4 py-2 bg-white rounded-xl'
      style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)' }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Type your message... HERE'
        className='w-full py-2 overflow-hidden text-sm bg-transparent outline-none resize-none '
      />
      <button
        type='submit'
        className='p-3 rounded-lg bg-orange'
        title='Send'
        disabled={isSending}
      >
        <span className='flex items-center justify-center gap-2 text-white'>
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
