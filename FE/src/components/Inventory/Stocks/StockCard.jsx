import React from 'react'

export const StockCard = ({ ingredient }) => {
  return (
    <div className='flex flex-col items-center justify-around px-5 py-10 space-y-5 bg-white shadow-md rounded-xl flex-cols'>
      <div className='w-32 h-32'>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/ingredients-image/${ingredient.image}`}
          className='object-contain w-full h-full rounded-xl'
        />
      </div>

      <div className='w-full space-y-2 text-sm font-medium'>
        <div className='flex justify-between '>
          <p>Name:</p>
          <p className='text-orange'>{ingredient.name}</p>
        </div>

        <div className='flex justify-between'>
          <p>Stock:</p>
          <p className='text-orange'>
            {ingredient.stock} <span className='uppercase'>{ingredient.unit}</span>
          </p>
        </div>

        <div className='flex justify-between'>
          <p>Unit:</p>
          <p className='uppercase text-orange'>{ingredient.unit}</p>
        </div>

        <div className='flex justify-between'>
          <p>Threshold:</p>
          <p className='text-orange'>{ingredient.lowStockThreshold}</p>
        </div>
      </div>
    </div>
  )
}
