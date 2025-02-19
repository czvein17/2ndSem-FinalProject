import React, { memo } from 'react'

export const ProductsAnalytic = memo(({ testValue }) => {
  console.log('ProductsAnalytic Rendered')
  return (
    <div
      className='flex-shrink-0 h-48 p-3 bg-white rounded-xl drop-shadow-lg'
      style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
    >
      1{testValue}
    </div>
  )
})
