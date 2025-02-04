import React from 'react'

export const PaymentOrderItemsCard = ({ item }) => {
  return (
    <div
      className='bg-secondBg h-[100px] rounded-xl flex space-x-2 p-2'
      style={{ boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.5)' }}
    >
      <div className='w-20 h-20 my-auto'>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/coffee-image/${item.product.image}`}
          alt={item.product.image}
          className='object-contain w-full h-full rounded-xl'
        />
      </div>

      <div>
        <h1>{item.product.name}</h1>
        <h1>QTY: {item.quantity}</h1>
        <h1>PRICE: {item.price}</h1>
      </div>
    </div>
  )
}
