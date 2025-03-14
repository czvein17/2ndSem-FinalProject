import React, { useState } from 'react'
import { EditProductModal } from './EditProductModal'

export const PrimaryDetails = ({ coffee }) => {
  const [selectedSize, setSelectedSize] = useState('small')

  return (
    <div className='flex h-full px-5 mt-4 '>
      <div className='flex flex-col w-full space-y-10 '>
        <div className='w-full space-y-5 text-base '>
          <h1 className='text-xl font-semibold'>Primary Details</h1>

          <div className='flex w-full gap-20 font-medium'>
            <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Product ID:</p>
            <p>{coffee._id}</p>
          </div>

          <div className='flex gap-20 font-medium'>
            <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Product Name</p>
            <p>{coffee.name}</p>
          </div>

          <div className='flex gap-20 font-medium'>
            <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>
              Product Description
            </p>
            <p className='w-[60%] text-wrap'>{coffee.description}</p>
          </div>

          <div className='flex gap-20 font-medium'>
            <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Product Category</p>
            <p>{coffee.category}</p>
          </div>
        </div>

        <div className='w-full space-y-5 text-base '>
          <h1 className='text-lg font-semibold'>Ingredients</h1>
          <div className='flex gap-5'>
            <button
              className={`px-4 py-2 rounded ${selectedSize === 'small' ? 'bg-orange text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedSize('small')}
            >
              Small
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedSize === 'medium' ? 'bg-orange text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedSize('medium')}
            >
              Medium
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedSize === 'large' ? 'bg-orange text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedSize('large')}
            >
              Large
            </button>
          </div>
          {coffee.ingredients.map((ingredient, index) => (
            <div className='space-y-2' key={index}>
              <div className='flex gap-20 font-medium'>
                <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Name</p>
                <p>{ingredient.ingredient.name}</p>
              </div>

              <div className='flex gap-20 font-medium'>
                <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Amount</p>
                <p className='uppercase'>
                  {ingredient.quantity[selectedSize]} {ingredient.ingredient.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center flex-shrink-0 w-1/4 gap-2 space-y-10'>
        <div className='p-5 border-2 border-dashed h-60 w-60 rounded-xl border-orange'>
          <img
            className='object-contain w-full h-full rounded-xl'
            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${coffee.image}`}
            alt={coffee.name}
          />
        </div>

        <div className='w-full h-full'>
          <div className='w-full space-y-5 text-base '>
            <h1 className='text-lg font-semibold'>Prices</h1>

            <div className='flex w-full gap-20 font-medium'>
              <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Small</p>
              <p>
                <span>&#8369;</span>
                {coffee.prices.small}
              </p>
            </div>

            <div className='flex w-full gap-20 font-medium'>
              <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Medium</p>
              <p>
                <span>&#8369;</span>
                {coffee.prices.medium}
              </p>
            </div>

            <div className='flex w-full gap-20 font-medium'>
              <p className='w-1/6 text-[#3B3B3B80] flex-shrink-0'>Large</p>
              <p>
                <span>&#8369;</span>
                {coffee.prices.large}
              </p>
            </div>

            <h1 className='text-lg font-semibold'>Mood Tags</h1>

            <div className='flex flex-wrap gap-2 '>
              {coffee.moodTags.map((moodTag, index) => (
                <span
                  key={index}
                  className='px-4 py-2 text-white rounded-full bg-orange'
                >
                  {moodTag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
