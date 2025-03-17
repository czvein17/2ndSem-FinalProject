import React from 'react'
import { HiOutlineViewGrid, HiOutlineUser } from 'react-icons/hi'
import {
  TbSmartHome,
  TbBookmark,
  TbFile,
  TbSettings,
  TbLogout,
} from 'react-icons/tb'

import CUP_OF_CHI from '../../assets/images/logo.svg'

import { SidebarList as SidebarListComponent } from './SidebarList'
import { useAuth } from '../../hooks/useAuth'

export const UserSidebar = () => {
  const { logout, isLoggedIn } = useAuth()

  const sidebarList = [
    {
      name: 'Home Page',
      icon: <TbSmartHome size={26} />,
      path: '/user',
    },

    {
      name: 'Orders',
      icon: <TbBookmark size={26} />,
      path: '/user/orders',
    },
    // {
    //   name: 'History',
    //   icon: <TbFile size={26} />,
    //   path: '/user/history',
    // },
  ]

  const userSetting = [
    {
      name: 'Profile',
      icon: <HiOutlineUser size={26} />,
      path: '/user/profile',
    },

    {
      name: 'Settings',
      icon: <TbSettings size={26} />,
      path: '/user/settings',
    },
  ]

  const filterSidebar = isLoggedIn ? sidebarList : sidebarList.slice(0, 2)

  return (
    <nav className='flex flex-col justify-between flex-shrink-0 w-64 bg-white border-r-2 border-gray-100'>
      <div className='w-full h-32 p-5 mx-auto '>
        <img src={CUP_OF_CHI} alt='logo' className='object-contain w-full h-full ' />
      </div>

      <div className='mt-10 mb-auto'>
        <ul className='space-y-4 text-textBlack'>
          {filterSidebar.map((item, index) => (
            <SidebarListComponent key={index} item={item} />
          ))}
        </ul>

        {isLoggedIn && (
          <>
            <hr className='my-5 border-t-2' />
            <ul className='space-y-4 text-textBlack'>
              {userSetting.map((item, index) => (
                <SidebarListComponent key={index} item={item} index={index} />
              ))}
            </ul>
          </>
        )}
      </div>

      <button
        className='flex items-center gap-3 px-5 py-3 mx-auto mb-10 text-sm transition-all duration-150 ease-in-out hover:text-orange rounded-xl hover:bg-secondary'
        onClick={logout}
      >
        <TbLogout size={26} />
        Logout
      </button>
    </nav>
  )
}
