import { useEffect, useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { useCartContext } from '../../hooks/useCartContext'
import { createOrder } from '../../API/order'

import { IoAddOutline, IoRemove } from 'react-icons/io5'

import { ModalWrapper } from '../ModalWrapper'
export const CartContainer = () => {
  const { cart, applyDiscount, clearCart, addToCart, removeFromCart } =
    useCartContext()

  const orderForModalRef = useRef()
  const discountModalRef = useRef()
  const loadingModalRef = useRef()
  const errorModalRef = useRef()
  const cartContainerRef = useRef()

  const navigate = useNavigate()

  const [orderName, setOrderName] = useState('')
  const [validateOrder, setValidateError] = useState('')

  const toggleModal = (modal) => modal.current.openModal()
  const closeModals = (modal) => modal.current.closeModal()

  const {
    mutate: postOrder,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setOrderName('')
      closeModals(loadingModalRef)
      navigate(`/user?order=${data.d._id}`)
      clearCart()
    },
  })

  const handleDiscountChange = (event) => {
    const discountType = event.target.value
    applyDiscount(discountType)
  }

  const handleConfirmOrder = (e) => {
    e.preventDefault()

    if (orderName === '') {
      setValidateError('Please enter a name')
      return
    }

    console.log('Confirm Order Triggered')
    console.log('Cart Items:', cart.items)

    if (cart.items.length === 0) {
      console.log('Cart is empty')
      return
    }

    console.log('Posting Order:', cart)

    const payload = {
      recipient: orderName,
      discountType: cart.discountType,
      orderItems: cart.items,
    }
    closeModals(orderForModalRef)
    postOrder(payload)
  }

  const prices = [
    {
      title: 'Subtotal',
      price: cart.subtotal,
    },
    {
      title: 'Tax',
      price: cart.tax,
    },

    {
      title: 'Discount',
      price: cart.discount,
      button: 'Apply Discount',
    },
  ]

  useEffect(() => {
    if (cartContainerRef.current) {
      cartContainerRef.current.scrollTop = cartContainerRef.current.scrollHeight
    }
  }, [cart.items])

  if (isPending) toggleModal(loadingModalRef)
  if (isError) {
    closeModals(loadingModalRef)
    toggleModal(errorModalRef)
  }

  return (
    <div className='w-[400px] border-l-2 bg-white px-5 h-full flex flex-col space-y-5 py-10 flex-shrink-0'>
      {/* <h1 className='mx-auto text-2xl font-medium uppercase'>Cart Orders</h1> */}
      <div className='h-full overflow-hidden '>
        <div
          className='h-full p-2 space-y-2 overflow-y-auto custom-scrollbar'
          ref={cartContainerRef}
        >
          {cart.items.map((item, index) => (
            <div
              key={item._id + item.size}
              className='flex px-3 py-6 space-x-2 border-b-2 border-[#D9D9D9]'
            >
              <div className='flex-shrink-0 w-24 h-24 my-auto bg-secondBg rounded-xl'>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${item.image}`}
                  alt=''
                  className='object-contain w-full h-full rounded-xl'
                />
              </div>

              <div className='flex flex-col justify-between w-full text-sm font-medium'>
                <div className='text-lg font-normal text-gray-500 '>
                  <h1 className='font-medium'>{item.name}</h1>
                  <h1 className='text-sm'>{item.size}</h1>
                </div>

                <div className='flex justify-between text-base'>
                  <h1 className='font-medium text-orange'>
                    ₱{item.prices[item.size]}
                  </h1>

                  <div className='flex items-center justify-center space-x-2 text-[#3D3D3D]'>
                    <button
                      className='w-7 h-7 ml-auto border-2 border-[#D9D9D9] rounded-full flex justify-center items-center'
                      onClick={() => removeFromCart(item._id, item.size)}
                    >
                      <IoRemove size={20} />
                    </button>
                    <h1 className='w-4 text-center text-md'>{item.quantity}</h1>
                    <button
                      className='flex items-center justify-center w-7 h-7 border-2 border-[#D9D9D9] rounded-full'
                      onClick={() => addToCart(item, item.size)}
                    >
                      <IoAddOutline size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex-shrink-0 space-y-1'>
        {prices.map((price, index) => (
          <div key={index} className={`flex justify-between px-2 py-2`}>
            <h1 className='text-gray-500'>{price.title} : </h1>
            <h1 className='font-demibold'>₱{price.price} </h1>
          </div>
        ))}
        <hr />
        <div className='flex justify-between px-2 py-3 '>
          <h1 className='text-gray-500'>Total :</h1>
          <h1 className='font-medium text-orange'>₱{cart.total} </h1>
        </div>
      </div>

      <div className='flex flex-col flex-shrink-0 w-full gap-4 transition-all duration-150 ease-in-out'>
        <button
          className='my-auto ml-3 mr-auto text-gray-500 hover:text-orange'
          onClick={() => toggleModal(discountModalRef)}
        >
          Apply Discount
        </button>
        <button
          className='px-20 py-3 mx-auto text-lg text-white transition-all duration-150 ease-in-out border rounded-full shadow-xl bg-orange hover:bg-transparent border-orange hover:text-orange'
          // onClick={handleConfirmOrder}
          onClick={() => toggleModal(orderForModalRef)}
        >
          Place an Order
        </button>
      </div>

      <ModalWrapper ref={orderForModalRef}>
        <div className='flex flex-col justify-center w-full space-y-2'>
          <p className='h-5 text-red-500'>{validateOrder}</p>
          <div className='flex gap-2 py-2 mx-2 border-b-2 border-orange'>
            <p className='flex-shrink-0 font-medium'>Order For:</p>
            <input
              className='w-full bg-transparent outline-none'
              type='text'
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
            />
          </div>
          <button
            className='px-5 py-2 mx-auto text-sm text-white transition-all duration-150 ease-in-out border rounded-full shadow-xl bg-orange hover:bg-transparent border-orange hover:text-orange'
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </div>
      </ModalWrapper>

      <ModalWrapper ref={discountModalRef}>
        <div className='m-5'>
          <h2>Select Discount Type</h2>
          <select onChange={handleDiscountChange}>
            <option value='none'>None</option>
            <option value='pwd'>PWD (20%)</option>
            <option value='senior'>Senior (20%)</option>
            <option value='promo'>Promo (10%)</option>
          </select>
        </div>
      </ModalWrapper>

      <ModalWrapper ref={loadingModalRef}>
        <h1>Loading...</h1>
      </ModalWrapper>

      <ModalWrapper ref={errorModalRef}>
        <h1 className='px-5 py-2 font-medium'>{error?.message}</h1>
      </ModalWrapper>

      {/* <ModalWrapper ref={paymentModalRef}>
        <h1>Success</h1>
      </ModalWrapper> */}
    </div>
  )
}
