import React from 'react'
import { UserSidebar } from '../../components/Sidebar/UserSidebar'
import { Outlet } from 'react-router-dom'

export const UserLayout = () => {
  return (
    <div className='flex h-screen overflow-hidden bg-secondBg font-poppins'>
      <UserSidebar />
      <div className='w-full min-h-screen overflow-auto'>
        <Outlet />
      </div>
    </div>
  )
}
