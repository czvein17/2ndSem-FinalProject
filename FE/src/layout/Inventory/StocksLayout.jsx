import React from 'react'
import { SeachBar } from '../../components/Inventory/SeachBar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export const StocksLayout = () => {
  return (
    <div className='flex flex-col h-full overflow-hidden bg-secondBg'>
      <div className='flex items-center justify-between flex-shrink-0 h-20 px-10 bg-white border-b-2 '>
        <SeachBar placeholder={'Search stock'} />
      </div>

      <div className='h-full'>
        <Outlet />
      </div>
    </div>
  )
}
