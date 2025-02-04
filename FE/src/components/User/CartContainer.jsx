import React, { useEffect, useRef } from 'react'
import { useCartContext } from '../../hooks/useCartContext'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../../API/order'
import { ModalWrapper } from '../ModalWrapper'
import { useNavigate } from 'react-router-dom'

export const CartContainer = () => {
  const { cart } = useCartContext()
  const loadingModalRef = useRef()
  const cartContainerRef = useRef()

  const navigate = useNavigate()

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
      console.log(data.d)
      closeModals(loadingModalRef)
      navigate(`/user?order=${data.d._id}`)
    },
  })

  const handleConfirmOrder = (e) => {
    e.preventDefault()

    if (cart.items.length === 0) return
    postOrder(cart.items)
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
    },
  ]

  useEffect(() => {
    if (cartContainerRef.current) {
      cartContainerRef.current.scrollTop = cartContainerRef.current.scrollHeight
    }
  }, [cart.items])

  if (isPending) toggleModal(loadingModalRef)

  return (
    <div className='w-[400px] border-l-2 bg-white px-5 h-full flex flex-col space-y-10 py-10 flex-shrink-0'>
      {/* <h1 className='mx-auto text-2xl font-medium uppercase'>Cart Orders</h1> */}
      <div className='h-full overflow-hidden '>
        <div
          className='h-full p-2 space-y-2 overflow-y-auto custom-scrollbar'
          ref={cartContainerRef}
        >
          {cart.items.map((item, index) => (
            <div
              key={item._id}
              className='flex px-3 py-6 space-x-2 border-b-2 border-[#D9D9D9]'
            >
              {console.log(item)}

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
                  <h1 className='font-medium '>₱{item.price}</h1>

                  <div className='flex items-center justify-center space-x-2'>
                    <button className='w-6 h-6 ml-auto text-white rounded-full bg-orange'>
                      +
                    </button>

                    <h1 className='text-md'>{item.quantity}</h1>

                    <button className='w-6 h-6 ml-auto text-white rounded-full bg-orange'>
                      -
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
            <h1 className='text-gray-500'>{price.title} :</h1>
            <h1 className='font-demibold'>₱{price.price} </h1>
          </div>
        ))}
        <hr />
        <div className='flex justify-between px-2 py-3 '>
          <h1 className='text-gray-500'>Total :</h1>
          <h1 className='font-medium text-orange'>₱{cart.total} </h1>
        </div>
      </div>

      <button
        className='flex-shrink-0 px-3 py-4 text-lg text-white transition-all duration-150 ease-in-out border rounded-full bg-orange hover:bg-transparent hover:border-orange hover:text-orange'
        onClick={handleConfirmOrder}
      >
        Place an Order
      </button>

      <ModalWrapper ref={loadingModalRef}>
        <h1>Loading...</h1>
      </ModalWrapper>

      {/* <ModalWrapper ref={paymentModalRef}>
        <h1>Success</h1>
      </ModalWrapper> */}
    </div>
  )
}
