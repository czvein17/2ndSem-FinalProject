import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { deleteProduct } from '../../../API/product'
import { queryClient } from '../../../API/http'

export const DeleteProductModal = ({ coffee, onClose, name, id }) => {
  console.log(name)

  const {
    mutate: deleteProductMutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries('products')
      onClose()
    },
  })

  return (
    <div className='flex flex-col p-3 space-y-3'>
      <h1>
        Are you sure you wanna delete{' '}
        <span className='font-medium'>{coffee.name}</span>?
      </h1>

      <div className='flex ml-auto'>
        {isPending && <p>Deleting...</p>}
        {!isPending && !isError && (
          <>
            <button
              className='px-3 py-1 text-white transition-all duration-150 ease-in-out border rounded-md border-orange bg-orange hover:bg-transparent hover:text-orange'
              onClick={() => deleteProductMutate(coffee._id)}
              //   onClick={handlleDelete}
            >
              Delete
            </button>
            <button
              className='px-3 py-1 ml-2 transition-all duration-150 ease-in-out border rounded-md text-orange border-orange hover:bg-orange hover:text-white'
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
