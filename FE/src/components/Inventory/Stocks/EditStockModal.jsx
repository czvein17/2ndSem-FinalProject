import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getAllSuppliers } from '../../../API/suppliers'
import { updateIngredient } from '../../../API/stocks'
import { queryClient } from '../../../API/http'
import { toast } from 'react-toastify'

export const EditStockModal = ({ ingredient, closeModal }) => {
  const [ingredientForm, setIngredinietForm] = useState({
    name: '',
    stock: '',
    unit: '',
    lowStockThreshold: '',
    supplier: '',
    image: null,
  })

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => getAllSuppliers(),
  })

  const { mutate: updateIngredientMutate } = useMutation({
    mutationFn: updateIngredient,
    onSuccess: () => {
      queryClient.invalidateQueries('ingredients')
      toast.success('Ingredient updated successfully')
      closeModal()
    },
    onError: (error) => {
      toast.error('Failed to update ingredient')
    },
  })

  useEffect(() => {
    setIngredinietForm({
      name: ingredient.name,
      stock: ingredient.stock,
      unit: ingredient.unit,
      lowStockThreshold: ingredient.lowStockThreshold,
      supplier: ingredient.supplier,
      image: ingredient.image,
    })
  }, [])

  const handleInputChange = (e) => {
    setIngredinietForm({
      ...ingredientForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    setIngredinietForm({
      ...ingredientForm,
      image: file,
    })
  }

  const handleSumbit = (e) => {
    e.preventDefault()

    updateIngredientMutate({
      id: ingredient._id,
      newIngredient: ingredientForm,
    })
  }

  return (
    <div className='w-[600px] font-poppins'>
      <h1 className='text-xl font-medium uppercase text-orange'>Edit Ingredient</h1>

      <p className='flex items-center justify-center h-8 text-sm font-medium text-red-600'>
        {/* {error} */}
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
                value={ingredientForm.name}
                onChange={handleInputChange}
              />
            </div>

            <div className='flex gap-2 py-2 border-b-2 border-orange'>
              <p className='font-medium'>Stocks :</p>
              <input
                type='number'
                className='bg-transparent outline-none no-spinner'
                name='stock'
                value={ingredientForm.stock}
                onChange={handleInputChange}
              />
            </div>

            <div className='flex gap-2 py-2 border-b-2 border-orange'>
              <p className='flex-shrink-0 font-medium'>Unit :</p>
              <select
                className='w-full outline-none cursor-pointer'
                name='unit'
                value={ingredientForm.unit}
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
                value={ingredientForm.supplier}
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
                name='lowStockThreshold'
                value={ingredientForm.lowStockThreshold}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className='flex w-full space-y-5'>
            <div
              className='flex items-center justify-center w-40 h-40 p-2 m-auto border-2 border-dashed rounded-lg cursor-pointer border-orange'
              onClick={() => document.getElementById('imageUpload').click()}
            >
              {ingredientForm.image && !(ingredientForm.image instanceof File) ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/ingredients-image/${ingredientForm.image}`}
                  alt='Preview'
                  className='object-contain w-full h-full rounded-lg'
                />
              ) : (
                ingredientForm.image instanceof File && (
                  <img
                    src={URL.createObjectURL(ingredientForm.image)}
                    alt='Preview'
                    className='object-contain w-full h-full rounded-lg'
                  />
                )
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
            Update Ingredient
          </button>
        </div>
      </form>
    </div>
  )
}
