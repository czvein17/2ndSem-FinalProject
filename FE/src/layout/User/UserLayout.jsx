import React from 'react'
import { UserSidebar } from '../../components/Sidebar/UserSidebar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export const UserLayout = () => {
  return (
    <div className='flex h-screen overflow-hidden bg-secondBg font-poppins'>
      <UserSidebar />
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
