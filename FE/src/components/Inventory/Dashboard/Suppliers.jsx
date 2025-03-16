import React from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { FaRegEye } from 'react-icons/fa'

export const Suppliers = ({ suppliers }) => {
  return (
    <div className='overflow-auto rounded-lg max-h-[500px]'>
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
              email
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
          {suppliers.map((supplier, index) => (
            <tr key={supplier._id} className='border-b border-orange'>
              <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                {supplier.name}
              </td>

              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {supplier.email}
              </td>

              {/* <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.lowStockThreshold}{' '}
                <span className='uppercase'>{item.unit}</span>
              </td>
              <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                {item.stock} <span className='uppercase'>{item.unit}</span>
              </td> */}

              <td className='text-sm font-medium whitespace-nowrap '>
                <div className='flex items-center justify-center w-full h-full'>
                  <button
                    className='px-1 py-1 text-orange'
                    //   onClick={() => confirmNotifyRef.current.openModal()}
                  >
                    <FiEdit2 size={24} />
                  </button>

                  <button
                    className='px-1 py-1 text-orange'
                    //   onClick={() => confirmNotifyRef.current.openModal()}
                  >
                    <FaRegEye size={24} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
