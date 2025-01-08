import React from 'react'
import { Sidebar } from '../../components/User/Sidebar'
import { Outlet } from 'react-router-dom'

export const UserLayout = () => {
  return (
    <div className='flex h-screen overflow-hidden bg-secondBg font-poppins'>
      <Sidebar />
      <div className='w-full min-h-screen overflow-auto'>
        <Outlet />
      </div>
    </div>
  )
}
