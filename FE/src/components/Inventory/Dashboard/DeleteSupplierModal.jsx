import React from 'react'
import { deleteSupplier } from '../../../API/suppliers'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../../../API/http'

export const DeleteSupplierModal = ({ supplier, closeModal }) => {
  const {
    mutate: deleteSupplierMutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries('suppliers')
      toast.success('Supplier deleted successfully')
      closeModal()
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })

  return (
    <div className='flex flex-col p-3 space-y-3'>
      <h1>
        Are you sure you wanna delete{' '}
        <span className='font-medium'>{supplier.name}</span>?
      </h1>

      <div className='flex ml-auto'>
        {isPending && <p>Deleting...</p>}
        {!isPending && !isError && (
          <>
            <button
              className='px-3 py-1 text-white transition-all duration-150 ease-in-out border rounded-md border-orange bg-orange hover:bg-transparent hover:text-orange'
              onClick={() => deleteSupplierMutate(supplier._id)}
              //   onClick={handlleDelete}
            >
              Delete
            </button>
            <button
              className='px-3 py-1 ml-2 transition-all duration-150 ease-in-out border rounded-md text-orange border-orange hover:bg-orange hover:text-white'
              onClick={() => closeModal()}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
