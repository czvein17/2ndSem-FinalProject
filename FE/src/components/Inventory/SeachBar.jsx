import React from 'react'
import { IoSearchOutline } from 'react-icons/io5'

export const SeachBar = ({ search, onChange, placeholder }) => {
  return (
    <div
      className='flex items-center w-1/4 gap-2 px-2 rounded-full h-9 bg-secondBg'
      style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
    >
      <span>
        <IoSearchOutline size={20} />
      </span>
      <input
        type='text'
        placeholder={placeholder || 'Search...'}
        className='w-full text-sm bg-transparent outline-none'
        value={search}
        onChange={onChange}
      />
    </div>
  )
}
