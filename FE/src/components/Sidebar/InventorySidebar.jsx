import React from 'react'

import CUP_OF_CHI from '../../assets/images/Inventory_logo.svg'
import { LuLayoutDashboard, LuBox, LuPackage, LuShoppingCart } from 'react-icons/lu'
import { HiOutlineChartBar } from 'react-icons/hi2'

import { SidebarList } from './SidebarList'

export const InventorySidebar = () => {
  const sidebarList = [
    {
      name: 'Dashboard',
      path: '/inventory',
      icon: <LuLayoutDashboard size={26} />,
    },
    {
      name: 'Products',
      path: '/inventory/products',
      icon: <LuBox size={26} />,
    },
    {
      name: 'Stocks',
      path: '/inventory/stocks',
      icon: <LuPackage size={26} />,
    },
    {
      name: 'Orders',
      path: '/inventory/orders',
      icon: <LuShoppingCart size={26} />,
    },
    {
      name: 'Sales',
      path: '/inventory/sales',
      icon: <HiOutlineChartBar size={26} />,
    },
  ]

  return (
    <nav className='flex flex-col justify-between flex-shrink-0 w-64 bg-white border-r-2 border-gray-100'>
      <div className='w-full h-32 p-5 mx-auto '>
        <img src={CUP_OF_CHI} alt='logo' className='object-contain w-full h-full ' />
      </div>

      <ul className='mt-10 mb-auto space-y-2 text-textBlack'>
        {sidebarList.map((item, index) => (
          <SidebarList key={index} item={item} />
        ))}
      </ul>

      <div></div>
    </nav>
  )
}
