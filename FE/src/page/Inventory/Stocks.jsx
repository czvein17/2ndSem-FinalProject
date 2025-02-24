import { useQuery } from '@tanstack/react-query'
import React, { useRef } from 'react'
import { getAllIngredients } from '../../API/stocks'
import { StockCard } from '../../components/Inventory/Stocks/StockCard'
import { ModalWrapper } from '../../components/ModalWrapper'

export const Stocks = () => {
  const addIngredientRef = useRef()

  const {
    data: ingredients,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => getAllIngredients(),
  })

  return (
    <div className='flex flex-col h-full overflow-auto'>
      <div className='flex-shrink-0 p-5 h-14'>
        <button
          className='px-5 py-2 text-sm text-white rounded-lg bg-orange'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
          onClick={() => addIngredientRef.current.openModal()}
        >
          Add
        </button>
      </div>
      {!isPending && !isError && (
        <div className='grid h-full grid-cols-5 gap-4 p-5'>
          {ingredients?.d.map((ingredient) => (
            <StockCard key={ingredient._id} ingredient={ingredient} />
          ))}
        </div>
      )}

      <ModalWrapper ref={addIngredientRef}>
        <div className='w-[600px]'>
          <h1 className='text-xl font-medium uppercase text-orange'>
            Add Ingredient
          </h1>
        </div>
      </ModalWrapper>
    </div>
  )
}
