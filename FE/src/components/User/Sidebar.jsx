import React from 'react'
import { HiOutlineViewGrid, HiOutlineUser } from 'react-icons/hi'
import {
  TbSmartHome,
  TbBookmark,
  TbFile,
  TbSettings,
  TbLogout,
} from 'react-icons/tb'

import { UserSideBarList } from './UserSideBarList'
import { useAuth } from '../../hooks/useAuth'

export const Sidebar = () => {
  const { logout, isLoggedIn } = useAuth()

  const sidebarList = [
    {
      name: 'Home Page',
      icon: <TbSmartHome size={26} />,
      path: '/user',
    },
    {
      name: 'Menu',
      icon: <HiOutlineViewGrid size={26} />,
      path: '/user/menu',
    },
    {
      name: 'Orders',
      icon: <TbBookmark size={26} />,
      path: '/user/orders',
    },
    {
      name: 'History',
      icon: <TbFile size={26} />,
      path: '/user/history',
    },
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
    <nav className='flex flex-col justify-between w-64 py-10 bg-white border-r-2 border-gray-100'>
      <div className='mx-auto'>LOGO HERE</div>
      <div className='mt-32 mb-auto'>
        <ul className='space-y-4 text-textBlack'>
          {filterSidebar.map((item, index) => (
            <UserSideBarList key={index} item={item} />
          ))}
        </ul>

        {isLoggedIn && (
          <>
            <hr className='my-5 border-t-2' />
            <ul className='space-y-4 text-textBlack'>
              {userSetting.map((item, index) => (
                <UserSideBarList key={index} item={item} index={index} />
              ))}
            </ul>
          </>
        )}
      </div>
      <button
        className='flex items-center gap-3 px-5 py-3 mx-auto text-sm transition-all duration-150 ease-in-out hover:text-orange rounded-xl hover:bg-secondary'
        onClick={logout}
      >
        <TbLogout size={26} />
        Logout
      </button>
    </nav>
  )
}
