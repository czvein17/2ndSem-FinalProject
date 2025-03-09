import React, { useState } from 'react'
import { AddProductInputField } from './AddProductInputField'
import { getAllIngredients } from '../../../API/stocks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IngredientInputField } from './IngredientInputField'
import { createNewProduct } from '../../../API/product'
import { queryClient } from '../../../API/http'

export const AddProductModal = ({ onClose }) => {
  const [validationError, setValidationError] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    prices: {
      small: 0,
      medium: 0,
      large: 0,
    },
    category: '',
    moodTags: '',
    ingredients: [],
    image: null,
  })

  const {
    data: ingredientsData,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getAllIngredients,
  })

  const { mutate: createProductMutate } = useMutation({
    mutationFn: createNewProduct,
    onSuccess: () => {
      queryClient.invalidateQueries('products')
      onClose()
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name in newProduct.prices) {
      setNewProduct((prev) => ({
        ...prev,
        prices: {
          ...prev.prices,
          [name]: value,
        },
      }))
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setNewProduct((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target
    const ingredients = [...newProduct.ingredients]
    if (name === 'ingredient') {
      ingredients[index] = {
        ...ingredients[index],
        [name]: value,
      }
    } else {
      ingredients[index] = {
        ...ingredients[index],
        quantity: {
          ...ingredients[index].quantity,
          [name]: value,
        },
      }
    }
    setNewProduct((prev) => ({
      ...prev,
      ingredients,
    }))
  }

  const handleAddIngredient = () => {
    setNewProduct((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { ingredient: '', quantity: { small: 0, medium: 0, large: 0 } },
      ],
    }))
  }

  const handleRemoveIngredient = (index) => {
    const ingredients = [...newProduct.ingredients]
    ingredients.splice(index, 1)
    setNewProduct((prev) => ({
      ...prev,
      ingredients,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      newProduct.name === '' ||
      newProduct.description === '' ||
      newProduct.category === '' ||
      newProduct.moodTags === '' ||
      newProduct.image === null ||
      newProduct.prices.small === 0 ||
      newProduct.prices.medium === 0 ||
      newProduct.prices.large === 0 ||
      newProduct.ingredients.length === 0
    ) {
      setValidationError('Please fill all the fields')
      return
    }

    const formattedProduct = {
      ...newProduct,
      moodTags: newProduct.moodTags.split(','),
    }

    console.log(formattedProduct)

    createProductMutate(formattedProduct)
  }

  return (
    <div className='w-[600px] flex flex-col max-h-[90vh] overflow-y-auto font-poppins custom-scrollbar'>
      <h1 className='text-lg font-medium text-orange'>Add Product</h1>

      <p className='h-5 text-center text-red-500'>{validationError}</p>

      <form className='flex flex-col w-full p-3 space-y-2' onSubmit={handleSubmit}>
        <div className='w-full space-y-3'>
          <div className='flex gap-10'>
            <div className='w-full space-y-3'>
              <AddProductInputField
                label='Name :'
                type='text'
                name='name'
                value={newProduct.name}
                onChange={handleInputChange}
              />
              <AddProductInputField
                label='Description :'
                type='text'
                name='description'
                value={newProduct.description}
                onChange={handleInputChange}
              />

              <div className='flex w-auto gap-2 py-2 border-b-2 border-orange'>
                <p className='flex-shrink-0 font-medium'>Category :</p>
                <select
                  className='w-full outline-none cursor-pointer'
                  name='category'
                  value={newProduct.category}
                  onChange={handleInputChange}
                >
                  <option value='' disabled>
                    Select category
                  </option>
                  <option value='Coffee'>Coffee</option>
                  <option value='Tea'>Tea</option>
                  <option value='Juice'>Juice</option>
                </select>
              </div>

              <AddProductInputField
                label='Mood Tags :'
                type='text'
                name='moodTags'
                value={newProduct.moodTags}
                onChange={handleInputChange}
              />
            </div>
            <div
              className='flex items-center justify-center flex-shrink-0 border-2 border-dashed rounded-lg h-52 w-52 border-orange'
              onClick={() => document.getElementById('imageUpload').click()}
            >
              {!newProduct.image ? (
                <>
                  <p className='p-10 font-medium text-center text-wrap'>
                    Click to upload image
                  </p>
                </>
              ) : (
                <img
                  src={URL.createObjectURL(newProduct.image)}
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

          <ul className='flex flex-col gap-2'>
            <h3 className='font-medium'>Prices :</h3>
            <ol className='flex gap-2 '>
              <li>
                <AddProductInputField
                  label='S :'
                  type='number'
                  name='small'
                  value={newProduct.prices.small}
                  onChange={handleInputChange}
                />
              </li>

              <li>
                <AddProductInputField
                  label='M :'
                  type='number'
                  name='medium'
                  value={newProduct.prices.medium}
                  onChange={handleInputChange}
                />
              </li>

              <li>
                <AddProductInputField
                  label='L :'
                  type='number'
                  name='large'
                  value={newProduct.prices.large}
                  onChange={handleInputChange}
                />
              </li>
            </ol>
          </ul>

          <div className='flex flex-col gap-2'>
            <h3 className='font-medium'>Ingredients :</h3>
            {newProduct.ingredients.map((ingredient, index) => (
              <IngredientInputField
                key={index}
                index={index}
                ingredient={ingredient}
                handleIngredientChange={handleIngredientChange}
                handleRemoveIngredient={handleRemoveIngredient}
                availableIngredients={ingredientsData?.d || []}
              />
            ))}
            <button
              type='button'
              onClick={handleAddIngredient}
              className='ml-auto text-orange'
            >
              Add Ingredient
            </button>
          </div>
        </div>

        <button
          className='p-2 mx-auto text-white rounded-lg bg-orange'
          type='submit'
        >
          Add Product
        </button>
      </form>
    </div>
  )
}
