import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useRef } from 'react'
import { getAllIngredients, notifySupplier } from '../../../API/stocks'
import { ModalWrapper } from '../../ModalWrapper'
import { toast } from 'react-toastify'

export const StockAlert = ({ stockAlert }) => {
  const confirmNotifyRef = useRef()

  const {
    mutate: notifySupplierMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: notifySupplier,
    onSuccess: (data) => {
      console.log(data)
      confirmNotifyRef.current.closeModal()
      toast.success('Supplier notified successfully')
    },
  })

  return (
    <div
      className='overflow-auto bg-white rounded-lg custom-scrollbar'
      style={{ maxHeight: '350px' }}
    >
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='sticky top-0 bg-orange'>
          <tr>
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Name
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Alert Count
            </th>
            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Stock Remaining
            </th>

            <th
              scope='col'
              className='px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase'
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className=''>
          {stockAlert.map((item, index) => (
            <tr key={item._id} className='border-b border-orange'>
              <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                {item.name}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.lowStockThreshold}{' '}
                <span className='uppercase'>{item.unit}</span>
              </td>
              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.stock} <span className='uppercase'>{item.unit}</span>
              </td>

              <td className='text-sm font-medium whitespace-nowrap'>
                <button
                  className='px-3 py-1 transition duration-150 ease-out border rounded-full hover:text-white hover:bg-orange border-orange text-orange'
                  onClick={() => confirmNotifyRef.current.openModal()}
                >
                  Notify Supplier
                </button>
              </td>

              <ModalWrapper ref={confirmNotifyRef}>
                <div className='w-[250px] space-y-3 '>
                  <h1 className='px-2 py-1 font-medium border-b-2 border-orange'>
                    Notify Supplier
                  </h1>

                  <p className='text-center whitespace-nowrap'>
                    Do you wanna notify supplier?
                  </p>
                  <div className='flex items-end justify-end gap-2'>
                    {isPending ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        <button
                          className='px-5 py-1 text-sm font-medium transition duration-150 ease-out border rounded-full text-orange border-orange hover:bg-orange hover:text-white'
                          onClick={() => confirmNotifyRef.current.closeModal()}
                        >
                          No
                        </button>
                        <button
                          className='px-5 py-1 text-sm font-medium text-white transition duration-100 ease-out rounded-full bg-orange hover:bg-opacity-70'
                          onClick={() => {
                            notifySupplierMutation(item._id)
                          }}
                        >
                          Yes
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </ModalWrapper>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
