import React, { useRef } from 'react'
import ModalWrapper from '../ModalWrapper'

const DeleteModalContent = ({ message, onClose, onDelete }) => {
  return (
    <div className='w-[300px] flex flex-col gap-5 items-center justify-center '>
      <p className='text-center text-lg  w-[80%]'>
        Are you sure you want to delete{' '}
        <span className='font-medium'>{message}</span>
      </p>

      <div className='flex gap-3'>
        <button
          className='bg-secondary py-2 px-5 rounded-md font-medium'
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className='bg-accent py-2 px-5 rounded-md text-white font-medium'
          onClick={onDelete}
        >
          Yes
        </button>
      </div>
    </div>
  )
}

export default DeleteModalContent
