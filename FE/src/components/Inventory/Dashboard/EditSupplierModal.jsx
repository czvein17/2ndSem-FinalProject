import { useMutation } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { updateSupplier } from '../../../API/suppliers'
import { queryClient } from '../../../API/http'
import { toast } from 'react-toastify'

export const EditSupplierModal = ({ defaultSupplier, closeModal }) => {
  const [supplier, setSupplier] = useState({
    name: '',
    contactNumber: '',
    email: '',
    address: '',
  })

  const { mutate: updateSupplierMutate } = useMutation({
    mutationFn: updateSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries('suppliers')
      toast.success('Supplier updated successfully')
      closeModal()
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })

  useEffect(() => {
    if (defaultSupplier) {
      setSupplier({
        name: defaultSupplier.name,
        contactNumber: defaultSupplier.contactNumber,
        email: defaultSupplier.email,
        address: defaultSupplier.address,
      })
    }
  }, [defaultSupplier])

  const handleSubmit = (e) => {
    e.preventDefault()

    updateSupplierMutate({ id: defaultSupplier._id, newSupplier: supplier })
  }

  const handleSupplierChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value })
  }

  return (
    <div className='space-y-5 w-[400px]'>
      <h1 className='font-medium text-orange '>Edit Supplier</h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col px-3 space-y-4 text-base font-medium'
      >
        <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
          <label
            htmlFor='name'
            className='flex-shrink-0 block text-sm font-medium text-gray-700'
          >
            Name :
          </label>

          <input
            className='w-full bg-transparent outline-none '
            type='text'
            name='name'
            value={supplier.name}
            onChange={handleSupplierChange}
          />
        </div>

        <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
          <label
            htmlFor='name'
            className='flex-shrink-0 block text-sm font-medium text-gray-700'
          >
            Contact Number :
          </label>

          <input
            className='w-full bg-transparent outline-none no-spinner'
            type='number'
            name='contactNumber'
            value={supplier.contactNumber}
            onChange={handleSupplierChange}
          />
        </div>

        <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
          <label
            htmlFor='name'
            className='flex-shrink-0 block text-sm font-medium text-gray-700'
          >
            Email :
          </label>

          <input
            className='w-full bg-transparent outline-none '
            type='text'
            name='email'
            value={supplier.email}
            onChange={handleSupplierChange}
          />
        </div>

        <div className='flex items-center w-full gap-2 py-2 border-b-2 border-orange bg-b'>
          <label
            htmlFor='name'
            className='flex-shrink-0 block text-sm font-medium text-gray-700'
          >
            Address :
          </label>

          <input
            className='w-full bg-transparent outline-none'
            type='text'
            name='address'
            value={supplier.address}
            onChange={handleSupplierChange}
          />
        </div>

        <button
          className='px-3 py-2 mx-auto text-white transition border rounded-xl bg-orange border-orange hover:bg-transparent hover:text-orange'
          type='submit'
        >
          Save Edit
        </button>
      </form>
    </div>
  )
}
