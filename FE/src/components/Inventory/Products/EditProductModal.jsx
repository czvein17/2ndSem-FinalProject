import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import { useParams } from 'react-router-dom'

import { IoIosRemoveCircleOutline } from 'react-icons/io'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getAllIngredients } from '../../../API/stocks'
import { updateProduct } from '../../../API/product'
import { queryClient } from '../../../API/http'
import { toast } from 'react-toastify'

export const EditProductModal = forwardRef(({ coffee }, ref) => {
  const { id } = useParams()
  const modalRef = useRef()

  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    prices: {
      small: 0,
      medium: 0,
      large: 0,
    },
    moodTags: [],
    ingredients: [],
    image: null,
  })

  console.log(product)

  const { data: ingredients } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getAllIngredients,
  })

  const { mutate: updateProductMutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries('coffee')
      toast.success('Product updated successfully')
      setIsOpen(false)
    },
  })

  useImperativeHandle(ref, () => ({
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
  }))

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setTimeout(() => setIsOpen(false), 100)
    }
  }

  useEffect(() => {
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (coffee) {
      setProduct((prev) => ({
        ...prev,
        name: coffee.name,
        description: coffee.description,
        category: coffee.category,
        prices: {
          small: coffee.prices.small,
          medium: coffee.prices.medium,
          large: coffee.prices.large,
        },
        moodTags: coffee.moodTags,
        ingredients: coffee.ingredients,
        image: coffee.image,
      }))
    }
  }, [coffee])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setProduct((prev) => ({
      ...prev,
      image: file,
    }))
  }

  const handleFieldChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleAddIngredient = () => {
    setProduct((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          quantity: {
            small: 0,
            medium: 0,
            large: 0,
          },

          ingredient: {
            _id: '',
            name: '',
            unit: '',
          },
        },
      ],
    }))
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleRemoveIngredient = (index) => {
    setProduct((prev) => {
      const updatedIngredients = [...prev.ingredients]
      updatedIngredients.splice(index, 1)
      return {
        ...prev,
        ingredients: updatedIngredients,
      }
    })
  }

  const handleIngredientSelectChange = (e, index) => {
    const { value } = e.target
    const selectedIngredient = ingredients.d.find(
      (ingredient) => ingredient._id === value,
    )
    setProduct((prev) => {
      const updatedIngredients = [...prev.ingredients]
      updatedIngredients[index].ingredient = selectedIngredient
      return {
        ...prev,
        ingredients: updatedIngredients,
      }
    })
  }

  const handleIngredientChange = (e, index, size) => {
    const { value } = e.target
    setProduct((prev) => {
      const updatedIngredients = [...prev.ingredients]
      updatedIngredients[index].quantity[size] = parseFloat(value)
      return {
        ...prev,
        ingredients: updatedIngredients,
      }
    })
  }

  const handleUpdateProduct = (e) => {
    e.preventDefault()

    const updatedProductWithSplittedMoodTags = {
      ...product,
      moodTags: Array.isArray(product.moodTags)
        ? product.moodTags
        : product.moodTags.split(','),
      ingredients: product.ingredients.map((ingredient) => {
        const { _id, ...rest } = ingredient
        return rest
      }),
    }

    updateProductMutate({
      id: coffee._id,
      newProduct: updatedProductWithSplittedMoodTags,
    })
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className='fixed top-0 left-0 w-[100%] h-[100%] bg-black bg-opacity-50 flex justify-center items-center'>
      <div className=' bg-white rounded-xl w-[750px] max-h-[900px] relative font-poppins flex flex-col  '>
        <div className='w-full px-5 py-3 bg-orange rounded-t-xl'>
          <h1 className='text-xl font-medium text-white uppercase'>Edit Product</h1>
        </div>

        <form
          onSubmit={handleUpdateProduct}
          className='overflow-auto custom-scrollbar'
        >
          <div className='flex w-full gap-10 px-5 py-3'>
            <div className='w-full space-y-3'>
              {/* NAME */}
              <div className='py-2 space-y-1 border-b-2 border-orange '>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-600'
                >
                  Product Name :
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  className='w-full px-2 bg-transparent outline-none'
                  value={product.name}
                  onChange={handleFieldChange}
                />
              </div>

              {/* DESCRIPTION */}
              <div className='py-2 space-y-1 border-b-2 border-orange '>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-600'
                >
                  Description :
                </label>

                <textarea
                  className='w-full px-2 bg-transparent outline-none min-h-2 '
                  name='description'
                  id='description'
                  value={product.description}
                  onChange={handleFieldChange}
                />
              </div>

              {/* CATEGORY */}
              <div className='py-2 space-y-1 border-b-2 border-orange '>
                <label
                  htmlFor='category'
                  className='block text-sm font-medium text-gray-600'
                >
                  Category :
                </label>
                <select
                  name='category'
                  className='w-full px-2 bg-transparent outline-none'
                  // value={product.category}
                  value={capitalizeFirstLetter(product.category)}
                  onChange={handleFieldChange}
                >
                  <option value='' defaultValue disabled>
                    Select Category
                  </option>
                  <option value='coffee'>Coffee</option>
                  <option value='Tea'>Tea</option>
                  <option value='Juice'>Juice</option>
                </select>
              </div>

              {/* MOOD TAGS */}
              <div className='py-2 space-y-1 border-b-2 border-orange '>
                <label
                  htmlFor='moodTags'
                  className='block text-sm font-medium text-gray-600'
                >
                  Mood Tags :
                </label>
                <input
                  type='text'
                  name='moodTags'
                  id='moodTags'
                  className='w-full px-2 bg-transparent outline-none'
                  value={product.moodTags}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            <div className='flex-shrink-0 my-auto space-y-3'>
              <div
                className='flex items-center justify-center p-5 my-auto border-2 border-dashed cursor-pointer h-60 w-60 border-orange rounded-xl'
                onClick={() => document.getElementById('imageUpload').click()}
              >
                {product.image && !(product.image instanceof File) ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${coffee.image}`}
                    alt={coffee.name}
                    className='object-contain w-full h-full rounded-xl'
                  />
                ) : (
                  product.image instanceof File && (
                    <img
                      src={URL.createObjectURL(product.image)}
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
              <p className='text-sm text-center'>Click the image to re-upload</p>
            </div>
          </div>

          <div className='h-full px-5 space-y-1'>
            {/* PRICES */}
            <div className='py-2 space-y-1 '>
              <label
                htmlFor='moodTags'
                className='block text-sm font-medium text-gray-600'
              >
                Prices &#8369;:
              </label>

              <div className='flex gap-5'>
                <div className='flex w-full py-2 border-b-2 border-orange'>
                  <label
                    htmlFor='small'
                    className='flex-shrink-0 block text-sm font-medium text-gray-600'
                  >
                    Small :
                  </label>
                  <input
                    type='number'
                    name='small'
                    id='small'
                    className='w-full px-2 bg-transparent outline-none no-spinner'
                    onChange={handleFieldChange}
                    value={product.prices.small}
                  />
                </div>

                <div className='flex w-full py-2 border-b-2 border-orange'>
                  <label
                    htmlFor='medium'
                    className='flex-shrink-0 block text-sm font-medium text-gray-600'
                  >
                    Medium :
                  </label>
                  <input
                    type='number'
                    name='medium'
                    id='medium'
                    className='w-full px-2 bg-transparent outline-none no-spinner'
                    onChange={handleFieldChange}
                    value={product.prices.medium}
                  />
                </div>

                <div className='flex w-full py-2 border-b-2 border-orange'>
                  <label
                    htmlFor='large'
                    className='flex-shrink-0 block text-sm font-medium text-gray-600'
                  >
                    Large :
                  </label>
                  <input
                    type='number'
                    name='large'
                    id='large'
                    className='w-full px-2 bg-transparent outline-none no-spinner'
                    onChange={handleFieldChange}
                    value={product.prices.large}
                  />
                </div>
              </div>
            </div>

            {/* INGREDIENTS */}
            <div className='flex flex-col gap-2 py-5 space-y-2'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium'>Ingredients :</h3>
                <button
                  type='button'
                  className='px-3 py-1 text-white bg-orange rounded-xl'
                  onClick={handleAddIngredient}
                >
                  Add Ingredient
                </button>
              </div>

              {product.ingredients.map((ingredient, index) => (
                <div key={index} className='flex flex-col gap-3'>
                  <div className='flex justify-between'>
                    <select
                      className='bg-transparent outline-none '
                      value={ingredient.ingredient._id}
                      onChange={(e) => handleIngredientSelectChange(e, index)}
                    >
                      {ingredients?.d.map((ingredient) => (
                        <option key={ingredient._id} value={ingredient._id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>

                    <button
                      className='flex items-center gap-1'
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      <span className='text-red-500'>
                        <IoIosRemoveCircleOutline size={24} />
                      </span>

                      <span className='text-sm'>Remove</span>
                    </button>
                  </div>
                  <div className='flex items-center gap-5'>
                    <div className='flex py-2 border-b-2 border-orange'>
                      <label
                        htmlFor={`small-${index}`}
                        className='text-sm font-medium text-gray-600'
                      >
                        Small:
                      </label>
                      <input
                        type='number'
                        name={`small-${index}`}
                        id={`small-${index}`}
                        className='w-full px-2 bg-transparent outline-none no-spinner'
                        value={ingredient.quantity.small}
                        onChange={(e) => handleIngredientChange(e, index, 'small')}
                      />
                    </div>
                    <div className='flex py-2 border-b-2 border-orange'>
                      <label
                        htmlFor={`medium-${index}`}
                        className='text-sm font-medium text-gray-600'
                      >
                        Medium:
                      </label>
                      <input
                        type='number'
                        name={`medium-${index}`}
                        id={`medium-${index}`}
                        className='w-full px-2 bg-transparent outline-none no-spinner'
                        value={ingredient.quantity.medium}
                        onChange={(e) => handleIngredientChange(e, index, 'medium')}
                      />
                    </div>
                    <div className='flex py-2 border-b-2 border-orange'>
                      <label
                        htmlFor={`large-${index}`}
                        className='text-sm font-medium text-gray-600'
                      >
                        Large:
                      </label>
                      <input
                        type='number'
                        name={`large-${index}`}
                        id={`large-${index}`}
                        className='w-full px-2 bg-transparent outline-none no-spinner'
                        value={ingredient.quantity.large}
                        onChange={(e) => handleIngredientChange(e, index, 'large')}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className='px-10 py-2 mx-auto text-white bg-orange rounded-xl'
                type='submit'
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal'),
  )
})
