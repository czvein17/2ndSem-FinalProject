import React, { useRef, useState } from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FiEdit2 } from 'react-icons/fi'
import { IoIosRemoveCircleOutline } from 'react-icons/io'

import { ModalWrapper } from '../../ModalWrapper'
import { EditStockModal } from './EditStockModal'

export const StockCard = ({ ingredient }) => {
  const editProductRef = useRef()
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false)

  return (
    <div
      className='relative flex flex-col items-center justify-around px-5 py-10 space-y-5 bg-white shadow-md rounded-xl flex-cols'
      style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
    >
      <div className='absolute top-0 right-0 flex px-2 py-1 bg-white rounded-t-xl'>
        <div className='relative'>
          <button
            className=' text-orange'
            onClick={() => setActionDropdownOpen(!actionDropdownOpen)}
          >
            <HiDotsHorizontal size={24} />
          </button>

          {actionDropdownOpen && (
            <ul className='absolute p-1 space-y-2 font-medium text-white uppercase shadow-md rounded-xl -bottom-100 -left-28 bg-orange '>
              <li
                className='flex items-center gap-2 px-4 py-1 transition rounded-lg cursor-pointer hover:bg-white hover:text-orange'
                onClick={() => {
                  editProductRef.current.openModal()
                  setActionDropdownOpen(false)
                }}
              >
                <FiEdit2 size={20} />
                Edit
              </li>
              <li className='flex items-center gap-2 px-4 py-1 transition rounded-lg cursor-pointer hover:bg-white hover:text-orange'>
                <IoIosRemoveCircleOutline size={20} />
                delete
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className='w-32 h-32'>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '')}/images/ingredients-image/${ingredient.image}`}
          className='object-contain w-full h-full rounded-xl'
        />
      </div>

      <div className='w-full space-y-2 text-sm font-medium'>
        <div className='flex justify-between '>
          <p>Name:</p>
          <p className='text-orange'>{ingredient.name}</p>
        </div>

        <div className='flex justify-between'>
          <p>Stock:</p>
          <p className='text-orange'>
            {ingredient.stock} <span className='uppercase'>{ingredient.unit}</span>
          </p>
        </div>

        <div className='flex justify-between'>
          <p>Unit:</p>
          <p className='uppercase text-orange'>{ingredient.unit}</p>
        </div>

        <div className='flex justify-between'>
          <p>Threshold:</p>
          <p className='text-orange'>{ingredient.lowStockThreshold}</p>
        </div>
      </div>

      <ModalWrapper ref={editProductRef}>
        <EditStockModal
          ingredient={ingredient}
          closeModal={() => editProductRef.current.closeModal()}
        />
      </ModalWrapper>
    </div>
  )
}
