import { useMutation, useQuery } from '@tanstack/react-query'
import { getAllSuppliers } from '../../../API/suppliers'
import { useState } from 'react'
import { createIngredient } from '../../../API/stocks'
import { queryClient } from '../../../API/http'

export const AddNewIngredientModal = ({ closeModal }) => {
  const [error, setError] = useState('')
  const [ingredient, setIngredients] = useState({
    name: '',
    stock: '',
    unit: '',
    threshold: '',
    supplier: '',
    image: null,
  })

  const {
    data: suppliers,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
  })

  const { mutate: AddNewIngredientMutate } = useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries('ingredients')
      closeModal()
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setIngredients((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIngredients((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }

  const handleSumbit = (e) => {
    e.preventDefault()
    console.log(ingredient)

    if (
      ingredient.name === '' ||
      ingredient.stocks === '' ||
      ingredient.unit === '' ||
      ingredient.threshold === '' ||
      ingredient.suppliers === ''
    ) {
      setError('Please fill all the fields')
      return
    }

    AddNewIngredientMutate(ingredient)
  }

  return (
    <div className='w-[600px]  font-poppins'>
      <h1 className='text-xl font-medium uppercase text-orange'>Add Ingredient</h1>

      <p className='flex items-center justify-center h-8 text-sm font-medium text-red-600'>
        {error}
      </p>
      <form
        className='flex flex-col w-full px-5 space-y-5 text-sm '
        onSubmit={handleSumbit}
      >
        <div className='flex w-full gap-5'>
          <div className='w-full space-y-5'>
            <div className='flex gap-2 py-2 border-b-2 border-orange'>
              <p className='font-medium'>Name :</p>
              <input
                type='text'
                className='bg-transparent outline-none'
                name='name'
                value={ingredient.name}
                onChange={handleInputChange}
              />
            </div>

            <div className='flex gap-2 py-2 border-b-2 border-orange'>
              <p className='font-medium'>Stocks :</p>
              <input
                type='number'
                className='bg-transparent outline-none'
                name='stock'
                value={ingredient.stock}
                onChange={handleInputChange}
              />
            </div>

            <div className='flex gap-2 py-2 border-b-2 border-orange'>
              <p className='flex-shrink-0 font-medium'>Unit :</p>
              <select
                className='w-full outline-none cursor-pointer'
                name='unit'
                value={ingredient.unit}
                onChange={handleInputChange}
              >
                <option value=''>Select Unit</option>
                <option value='kg'>Kilogram (kg)</option>
                <option value='g'>Gram (g)</option>
                <option value='l'>Liter (l)</option>
                <option value='ml'>Milliliter (ml)</option>
                <option value='pcs'>Pieces (pcs)</option>
              </select>
            </div>

            <div className='flex gap-2 py-2 border-b-2 border-orange'>
              <p className='flex-shrink-0 font-medium'>Supplier :</p>
              <select
                className='w-full outline-none cursor-pointer'
                name='supplier'
                value={ingredient.supplier}
                onChange={handleInputChange}
              >
                <option value=''>Select Supplier</option>
                {suppliers?.d?.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex gap-2 py-2 border-b-2 border-orange'>
              <p className='font-medium'>Threshold :</p>
              <input
                type='number'
                className='bg-transparent outline-none'
                name='threshold'
                value={ingredient.threshold}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className='flex w-full space-y-5'>
            <div
              className='flex items-center justify-center w-40 h-40 p-2 m-auto border-2 border-dashed rounded-lg cursor-pointer border-orange'
              onClick={() => document.getElementById('imageUpload').click()}
            >
              {!ingredient.image ? (
                <>
                  <p className='font-medium text-center'>Upload Image</p>
                </>
              ) : (
                <img
                  src={URL.createObjectURL(ingredient.image)}
                  alt='Preview'
                  className='object-cover w-full h-full rounded-lg'
                />
              )}

              <input
                id='imageUpload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-center py-5'>
          <button
            className='px-5 py-2 text-white bg-orange rounded-xl '
            type='submit'
          >
            Add Ingredient
          </button>
        </div>
      </form>
    </div>
  )
}
