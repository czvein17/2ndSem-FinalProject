import React from 'react'

import { TbCurrencyPeso } from 'react-icons/tb'
import { BiPurchaseTag } from 'react-icons/bi'
import { LuShoppingCart } from 'react-icons/lu'

import { useCartContext } from '../../hooks/useCartContext'
import { SalesChart } from '../../components/Inventory/Dashboard/SalesChart'
import { SalesByStatusChart } from '../../components/Inventory/Dashboard/SalesByStatusChart'
import { StockAlert } from '../../components/Inventory/Dashboard/StockAlert'

export const Dashboard = () => {
  const { pendingOrdersCount } = useCartContext()

  const summary = [
    {
      icon: <TbCurrencyPeso size={36} />,
      label: 'Total Sales',
      value: '0.00',
    },

    {
      icon: <LuShoppingCart size={36} />,
      label: 'Orders',
      value: pendingOrdersCount,
    },

    {
      icon: <BiPurchaseTag size={36} />,
      label: 'Purchases',
      value: '0',
    },
  ]

  return (
    <div className='h-full p-6 space-y-6 overflow-auto font-poppins'>
      <div
        className='p-6 bg-white rounded-xl '
        style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.2)' }}
      >
        <h2 className='text-lg font-bold uppercase'>Summary</h2>

        <div className='flex flex-wrap gap-6 min-w-40'>
          {summary.map((item, index) => (
            <div key={index} className='flex items-center gap-2 p-3 text-orange'>
              {item.icon}
              <div>
                <p className='text-lg font-bold '>
                  {item.label === 'Total Sales' && <span>&#8369;</span>}
                  {item.value}
                </p>
                <p className='text-sm font-medium'>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-6 gap-6'>
        <div
          className='col-span-4 p-8 space-y-6 bg-white rounded-xl'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
        >
          <div className='flex justify-between'>
            <h2 className='text-lg font-semibold'>Total Sales</h2>
            <h2 className='font-medium'>Last 7 Days</h2>
          </div>

          <SalesChart />
        </div>

        <div
          className='col-span-2 p-3 bg-white rounded-xl'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
        >
          2
        </div>

        <div
          className='col-span-3 p-8 space-y-6 bg-white rounded-xl'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
        >
          <div className='flex justify-between'>
            <h2 className='text-lg font-semibold'>Total Sales by Status</h2>
          </div>
          <SalesByStatusChart />
        </div>

        <div
          className='col-span-3 p-8 space-y-6 overflow-hidden bg-white rounded-xl'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)', height: '100%' }}
        >
          <div className='flex justify-between'>
            <h2 className='text-lg font-semibold'>Stock Alert</h2>
          </div>

          <StockAlert />
        </div>
      </div>
    </div>
  )
}
