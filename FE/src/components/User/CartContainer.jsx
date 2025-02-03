import React, { useRef } from 'react'
import { useCartContext } from '../../hooks/useCartContext'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../../API/order'
import { ModalWrapper } from '../ModalWrapper'
import { useNavigate } from 'react-router-dom'

export const CartContainer = () => {
  const { cart } = useCartContext()
  const loadingModalRef = useRef()

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
      title: 'Total',
      price: cart.total,
    },
    {
      title: 'Discount',
      price: cart.discount,
    },
  ]

  if (isPending) toggleModal(loadingModalRef)

  return (
    <div className='w-[400px] border-l-2 bg-white px-5 h-full flex flex-col space-y-10 py-10 flex-shrink-0'>
      <h1 className='mx-auto text-2xl font-medium uppercase'>Cart Orders</h1>
      <div className='h-full overflow-hidden '>
        <div className='h-full p-2 space-y-2 overflow-y-auto'>
          {cart.items.map((item, index) => (
            <div
              key={item._id}
              className='flex px-5 py-3 bg-white rounded-xl drop-shadow-lg'
            >
              {console.log(item)}

              <div className='w-20 h-20 my-auto'>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${item.image}`}
                  alt=''
                  className='object-contain w-full h-full rounded-xl'
                />
              </div>

              <div className='space-y-1 text-sm font-medium'>
                <h1 className='font-medium'>{item.name}</h1>
                <h1 className='inline-flex items-center justify-center w-6 h-6 text-center text-white uppercase rounded-full bg-orange'>
                  {item.size.charAt(0)}
                </h1>

                <h1>qty: {item.quantity}</h1>
                <h1>Price: {item.quantity * item.price}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex-shrink-0 space-y-2 '>
        {prices.map((price, index) => (
          <div
            key={index}
            className='flex justify-between px-2 py-1 font-medium border-b-2 border-orange'
          >
            <h1>{price.title} :</h1>
            <h1>₱ {price.price} </h1>
          </div>
        ))}
      </div>

      <button
        className='flex-shrink-0 px-3 py-4 text-lg text-white transition-all duration-150 ease-in-out border bg-orange rounded-2xl hover:bg-transparent hover:border-orange hover:text-orange'
        onClick={handleConfirmOrder}
      >
        Confirm Order
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
