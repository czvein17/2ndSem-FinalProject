import { IoAddOutline, IoRemove } from 'react-icons/io5'
import { useCartContext } from '../../hooks/useCartContext'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { ModalWrapper } from '../ModalWrapper'

export const CoffeeCard = memo(({ coffee }) => {
  const coffeeSizeRef = useRef()
  const { cart, addToCart, removeFromCart } = useCartContext()
  const [size, setSize] = useState('')
  const sizes = ['small', 'medium', 'large']

  const findCoffee = useMemo(() => {
    return cart.items.find(
      (cartItem) => cartItem._id === coffee._id && cartItem.size === size,
    )
  }, [cart.items, coffee._id, size])

  const setCoffeeSize = (newSize) => setSize(newSize)

  const handleAddToCart = (e) => {
    e.preventDefault()

    if (!size) {
      coffeeSizeRef.current.openModal()
      return
    }

    addToCart(coffee, size)
  }

  return (
    <div className='min-h-[300px] bg-white rounded-xl flex p-3 text-sm gap-3  shadow-md'>
      <div className='flex flex-col flex-shrink-0 w-40 gap-2'>
        <div className='flex h-full rounded-lg bg-secondBg'>
          <div className='w-32 h-32 m-auto'>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${coffee.image}`}
              className='object-contain w-full h-full rounded-lg'
              alt=''
            />
          </div>
        </div>
        <div className='flex items-center justify-center h-20 gap-2 '>
          <button
            className='flex items-center justify-center w-8 h-8 border-2 border-[#D9D9D9] rounded-full '
            onClick={() => removeFromCart(coffee._id, size)}
          >
            <IoRemove size={24} />
          </button>

          <p className='w-4 text-center text-md'>
            {findCoffee ? findCoffee.quantity : 0}
          </p>

          <button
            className='flex items-center justify-center w-8 h-8 border-2 border-[#D9D9D9] rounded-full'
            onClick={handleAddToCart}
          >
            <IoAddOutline size={24} />
          </button>
        </div>
      </div>
      <div className='flex flex-col justify-between w-full gap-2 py-3'>
        <div>
          <h3 className='text-lg font-semibold'>
            {coffee.name}{' '}
            <span className='font-medium text-orange'>${coffee.price}</span>
          </h3>

          <p className='text-sm font-medium  text-[#3b3b3b80]'>
            {coffee.description}
          </p>
        </div>

        <div className='flex flex-col w-full gap-2'>
          <div className='flex flex-wrap gap-2'>
            {sizes.map((size, index) => (
              <Label
                key={index}
                name={`size-${coffee._id}`}
                value={size}
                setCoffeeSize={setCoffeeSize}
              />
            ))}
          </div>

          <button
            className={`w-full px-3 py-2 font-medium transition-all duration-150 ease-in-out border-2 rounded-full text-orange border-orange hover:bg-orange hover:text-white ${findCoffee ? 'bg-orange text-white' : ''}`}
            onClick={handleAddToCart}
          >
            {findCoffee ? 'Added to Cart' : 'Add to cart'}
          </button>
        </div>

        <ModalWrapper ref={coffeeSizeRef}>
          <div className='flex flex-col gap-5 m-4'>
            <h1 className='font-medium'>
              Please select a size before adding the coffee to your cart.
            </h1>
            <button>
              <button
                className='px-3 py-2 my-auto font-medium transition-all duration-150 ease-in-out border-2 rounded-xl text-orange border-orange hover:bg-orange hover:text-white'
                onClick={() => coffeeSizeRef.current.closeModal()}
              >
                Go Back
              </button>
            </button>
          </div>
        </ModalWrapper>
      </div>
    </div>
  )
})

const Label = memo(({ name, value, setCoffeeSize }) => {
  return (
    <label className='flex gap-10 cursor-pointer'>
      <input
        type='radio'
        name={name}
        value={value}
        className='hidden peer'
        onClick={() => setCoffeeSize(value)}
      />
      <span className='h-8 w-8 text-xs border border-[#D9D9D9] rounded-full peer-checked:bg-[#3D3D3D] peer-checked:text-white uppercase vertical-align-middle flex items-center justify-center'>
        {value.charAt(0)}
      </span>
    </label>
  )
})
