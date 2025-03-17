import React, { useRef } from 'react'

const DeleteModalContent = ({ message, onClose, onDelete }) => {
  return (
    <div className='w-[300px] flex flex-col gap-5 items-center justify-center '>
      <p className='text-center text-lg  w-[80%]'>
        Are you sure you want to delete{' '}
        <span className='font-medium'>{message}</span>
      </p>

      <div className='flex gap-3'>
        <button
          className='px-5 py-2 font-medium transition border rounded-md border-orange text-orange hover:bg-orange hover:text-white'
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className='px-5 py-2 font-medium text-white transition border rounded-md bg-orange border-orange hover:bg-transparent hover:text-orange'
          onClick={onDelete}
        >
          Yes
        </button>
      </div>
    </div>
  )
}

export default DeleteModalContent
