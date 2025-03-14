import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../../../API/product'

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

  const handleFieldChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className='fixed top-0 left-0 w-[100%] h-[100%] bg-black bg-opacity-50 flex justify-center items-center'>
      <div className=' bg-white rounded-xl w-[750px] h-[800px] relative font-poppins flex flex-col'>
        <div className='w-full px-5 py-3 bg-orange rounded-t-xl'>
          <h1 className='text-xl font-medium text-white uppercase'>Edit Product</h1>
        </div>

        <form>
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
                  className='w-full px-2 bg-transparent outline-none'
                  value={product.category}
                  onChange={handleFieldChange}
                >
                  <option value='' defaultValue disabled>
                    Select Category
                  </option>
                  <option value='coffee'>Coffee</option>
                  <option value='tea'>Tea</option>
                  <option value='juice'>Juice</option>
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
              <div className='flex items-center justify-center p-5 my-auto border-2 border-dashed h-60 w-60 border-orange rounded-xl'>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${coffee.image}`}
                  alt={coffee.name}
                  className='object-contain w-full h-full rounded-xl'
                />
              </div>
              <p className='text-sm text-center'>Click the image to re-upload</p>
            </div>
          </div>

          <div className='h-full px-5'>
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
            <div></div>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal'),
  )
})
