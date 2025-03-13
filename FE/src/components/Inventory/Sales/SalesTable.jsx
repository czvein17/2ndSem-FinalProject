import React from 'react'

import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'

export const SalesTable = ({ sales, currentPage, setCurrentPage }) => {
  const formatCreatedAt = (date) => {
    const now = new Date()
    const createdAt = new Date(date)
    const differenceInSeconds = Math.floor((now - createdAt) / 1000)
    const differenceInMinutes = Math.floor(differenceInSeconds / 60)
    const differenceInHours = Math.floor(differenceInMinutes / 60)
    const differenceInDays = Math.floor(differenceInHours / 24)

    if (differenceInDays >= 1) {
      return createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } else if (differenceInHours >= 1) {
      return `${differenceInHours} hours ago`
    } else if (differenceInMinutes >= 1) {
      return `${differenceInMinutes} minutes ago`
    } else {
      return `${differenceInSeconds} seconds ago`
    }
  }

  const formatUpdatedAt = (date) => {
    const now = new Date()
    const updatedAt = new Date(date)
    const differenceInSeconds = Math.floor((now - updatedAt) / 1000)
    const differenceInMinutes = Math.floor(differenceInSeconds / 60)
    const differenceInHours = Math.floor(differenceInMinutes / 60)
    const differenceInDays = Math.floor(differenceInHours / 24)

    if (differenceInDays >= 1) {
      return `${differenceInDays} days ago`
    } else if (differenceInHours >= 1) {
      return `${differenceInHours} hours ago`
    } else if (differenceInMinutes >= 1) {
      return `${differenceInMinutes} minutes ago`
    } else {
      return `${differenceInSeconds} seconds ago`
    }
  }

  return (
    <div className='flex flex-col h-full space-y-5 overflow-auto '>
      <table className='flex-shrink-0 table-fixed lg:w-full'>
        <thead className='h-[40px] w-full bg-orange text-white sticky top-0 border-b-2 rounded-xl border-b-black text-sm uppercase'>
          <tr>
            <th scope='col' className='font-medium first:rounded-tl-2xl'>
              ID
            </th>
            <th scope='col' className='font-medium'>
              Customer Name
            </th>
            <th scope='col' className='font-medium'>
              Total Amount
            </th>
            <th scope='col' className='font-medium'>
              Mode of Payment
            </th>
            <th scope='col' className='font-medium'>
              Payment Status
            </th>
            <th scope='col' className='font-medium'>
              Created At
            </th>

            <th scope='col' className='font-medium'>
              Updated At
            </th>
            <th scope='col' className='font-medium last:rounded-tr-2xl'>
              Action
            </th>
          </tr>
        </thead>

        <tbody className='h-full '>
          {sales.d.length === 0 && (
            <tr className='h-full'>
              <td colSpan={6} className='text-center'>
                No sales found
              </td>
            </tr>
          )}
          {sales.d.map((sale, index) => (
            <tr
              key={sale._id}
              className={`${index % 2 === 0 ? 'bg-white' : ''} border-b border-b-orange`}
            >
              <td className='whitespace-nowrap'>{sale._id}</td>
              <td className='px-3 py-4 text-center whitespace-nowrap'>
                {sale.order?.recipient}
              </td>
              <td className='px-3 py-4 text-center whitespace-nowrap'>
                <span>&#8369;</span>
                {sale.order?.totalAmount}
              </td>
              <td className='px-3 py-4 text-center whitespace-nowrap'>
                {sale.modeOfPayment}
              </td>
              <td className='px-3 py-4 text-center whitespace-nowrap'>
                {sale.paymentStatus}
              </td>

              <td className='px-3 py-4 text-center whitespace-nowrap'>
                {formatCreatedAt(sale.createdAt)}
              </td>

              <td className='px-3 py-4 text-center whitespace-nowrap'>
                {formatUpdatedAt(sale.updatedAt)}
              </td>

              <td>
                <button>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex items-center justify-end gap-2 mt-auto ml-auto text-white rounded-lg bg-orange'>
        <button
          className='px-2 py-2 bg-white bg-opacity-20'
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1)
            }
          }}
        >
          <HiChevronDoubleLeft size={16} />
        </button>
        <p className='text-sm text-center w-14'>Page {currentPage}</p>
        <button className='px-2 py-2 bg-white bg-opacity-20'>
          <HiChevronDoubleRight
            size={16}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </button>
      </div>
    </div>
  )
}
