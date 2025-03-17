import React from 'react'

export const ViewSupplierModal = ({ supplier, closeModal }) => {
  const handleCancel = (e) => {
    e.preventDefault()
    closeModal()
  }

  return (
    <div className='space-y-5 w-[400px]'>
      <h1 className='font-medium text-orange '>View Supplier</h1>

      <form
        onSubmit={handleCancel}
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
            className='w-full bg-transparent outline-none'
            type='text'
            name='name'
            value={supplier.name}
            disabled
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
            disabled
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
            className='w-full bg-transparent outline-none'
            type='text'
            name='email'
            value={supplier.email}
            disabled
          />
        </div>

        <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
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
            disabled
          />
        </div>

        <button
          className='px-3 py-2 mx-auto text-white transition border rounded-xl bg-orange border-orange hover:bg-transparent hover:text-orange'
          type='submit'
        >
          Close
        </button>
      </form>
    </div>
  )
}
