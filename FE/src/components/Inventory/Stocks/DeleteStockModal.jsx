import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { deleteIngredient } from '../../../API/stocks'
import { queryClient } from '../../../API/http'
import { toast } from 'react-toastify'

export const DeleteStockModal = ({ ingredient, closeModal }) => {
  const {
    mutate: deleteIngredientMutate,
    isPending,
    isError,
  } = useMutation({
    mutationFn: deleteIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries('ingredients')
      toast.success('Ingredient deleted successfully')
      closeModal()
    },
  })

  return (
    <div className='flex flex-col p-3 space-y-3'>
      <h1>
        Are you sure you wanna delete{' '}
        <span className='font-medium'>{ingredient.name}</span>?
      </h1>

      <div className='flex ml-auto'>
        {isPending && <p>Deleting...</p>}
        {!isPending && !isError && (
          <>
            <button
              className='px-3 py-1 text-white transition-all duration-150 ease-in-out border rounded-md border-orange bg-orange hover:bg-transparent hover:text-orange'
              onClick={() => deleteIngredientMutate(ingredient._id)}
              //   onClick={handlleDelete}
            >
              Delete
            </button>
            <button
              className='px-3 py-1 ml-2 transition-all duration-150 ease-in-out border rounded-md text-orange border-orange hover:bg-orange hover:text-white'
              onClick={closeModal}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
