import React from 'react'
import { Outlet } from 'react-router-dom'
import { InventorySidebar } from '../../components/Sidebar/InventorySidebar'

export const InventoryLayout = () => {
  return (
    <div className='flex h-screen overflow-hidden bg-secondBg font-poppins'>
      {/* <nav className='w-64 bg-white border-r-2'>test</nav> */}
      <InventorySidebar />
      <div className='w-full min-h-screen overflow-auto'>
        <Outlet />
      </div>
    </div>
  )
}
