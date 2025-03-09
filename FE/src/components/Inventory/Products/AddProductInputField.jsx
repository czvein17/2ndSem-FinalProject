import React from 'react'

export const AddProductInputField = ({ label, type, name, value, onChange }) => {
  return (
    <div className='flex w-auto gap-2 py-2 border-b-2 border-orange'>
      <p className='flex-shrink-0 font-medium'>{label}</p>
      <input
        type={type}
        name={name}
        value={value}
        className='w-full bg-transparent outline-none no-spinner'
        autoComplete='false'
        onChange={onChange}
      />
    </div>
  )
}
