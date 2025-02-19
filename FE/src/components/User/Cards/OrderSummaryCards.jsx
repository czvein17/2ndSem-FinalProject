import React from 'react'

export const OrderSummaryCards = ({ orderSummary }) => {
  return (
    <div className='flex justify-between  border-b-2 border-[#D9D9D9] py-1 px-2'>
      <h2 className='font-medium'>{orderSummary.title} :</h2>
      <h2 className='font-medium uppercase text-orange'>
        {orderSummary.title !== 'Discount Type' && <span>&#8369;</span>}
        {orderSummary.value}
      </h2>
    </div>
  )
}
