import React from 'react'
import { Outlet } from 'react-router-dom'
import { InventorySidebar } from '../../components/Sidebar/InventorySidebar'
import { ToastContainer } from 'react-toastify'

export const InventoryLayout = () => {
  return (
    <div className='flex h-screen overflow-hidden bg-secondBg font-poppins'>
      {/* <nav className='w-64 bg-white border-r-2'>test</nav> */}
      <InventorySidebar />
      <div className='w-full min-h-screen overflow-auto'>
        <Outlet />
      </div>

      <ToastContainer
        className='custom-toast-container'
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}
