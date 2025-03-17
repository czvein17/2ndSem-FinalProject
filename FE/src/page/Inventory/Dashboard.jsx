import React, { useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { TbCurrencyPeso } from 'react-icons/tb'
import { BiPurchaseTag } from 'react-icons/bi'
import { LuShoppingCart } from 'react-icons/lu'
import { IoIosArrowDown } from 'react-icons/io'
import { BsTruck } from 'react-icons/bs'

import { useCartContext } from '../../hooks/useCartContext'
import { SalesChart } from '../../components/Inventory/Dashboard/SalesChart'
import { SalesByStatusChart } from '../../components/Inventory/Dashboard/SalesByStatusChart'
import { StockAlert } from '../../components/Inventory/Dashboard/StockAlert'

import {
  getSalesByStatus,
  getSalesData,
  getTotalPurchase,
  getTotalSales,
} from '../../API/sales'
import { getLowStockIngredients } from '../../API/stocks'
import { createSupplier, getAllSuppliers } from '../../API/suppliers'
import { Suppliers } from '../../components/Inventory/Dashboard/Suppliers'
import { ModalWrapper } from '../../components/ModalWrapper'
import { toast } from 'react-toastify'
import { queryClient } from '../../API/http'

export const Dashboard = () => {
  const addSupplierRef = useRef()
  const { pendingOrdersCount } = useCartContext()
  const [timeRangeOptionOpen, setTimeRangeOptionOpen] = useState(false)
  const [timeRange, setTimeRange] = useState('last7days')

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactNumber: '',
    email: '',
    address: '',
  })

  const { data: totalPurchase } = useQuery({
    queryKey: ['totalPurchase'],
    queryFn: getTotalPurchase,
  })

  const { data: totalSales } = useQuery({
    queryKey: ['totalSales'],
    queryFn: getTotalSales,
  })

  const { data: salesData } = useQuery({
    queryKey: ['salesData', timeRange],
    queryFn: () => getSalesData(timeRange),
  })

  const { data: stockAlert } = useQuery({
    queryKey: ['stockAlert'],
    queryFn: () => getLowStockIngredients(),
  })

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: getAllSuppliers,
  })

  const { data: salesByStatus } = useQuery({
    queryKey: ['salesByStatus'],
    queryFn: getSalesByStatus,
  })

  const { mutate: postNewSupplierMutate } = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      toast.success('Supplier added successfully')
      queryClient.invalidateQueries('suppliers')
      addSupplierRef.current.closeModal()
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    postNewSupplierMutate(newSupplier)
  }

  const summary = [
    {
      icon: <TbCurrencyPeso size={36} />,
      label: 'Total Sales',
      value: totalSales?.d || 0.0,
    },

    {
      icon: <LuShoppingCart size={36} />,
      label: 'Orders',
      value: pendingOrdersCount,
    },

    {
      icon: <BiPurchaseTag size={36} />,
      label: 'Purchases',
      value: totalPurchase?.d || '0',
    },
    {
      icon: <BsTruck size={36} />,
      label: 'Suppliers',
      value: suppliers?.d?.length || 0,
    },
  ]

  const timeRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
  ]

  const timeRangeChangeHandler = (value) => {
    setTimeRangeOptionOpen(false)
    setTimeRange(value)
  }

  const selectedOption = timeRangeOptions.find(
    (option) => option.value === timeRange,
  )

  const handleNewSupplierFormChange = (e) => {
    setNewSupplier((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className='h-full p-6 space-y-6 overflow-auto font-poppins custom-scrollbar'>
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
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Total Sales</h2>

            <div className='relative'>
              <p
                className='flex items-center gap-2 px-3 py-2 space-x-5 font-medium text-center rounded-lg cursor-pointer w-28 whitespace-nowrap'
                onClick={() => setTimeRangeOptionOpen(!timeRangeOptionOpen)}
              >
                {selectedOption ? selectedOption.label : 'Select'}

                <span
                  className={`text-orange transition ${timeRangeOptionOpen ? 'transform -rotate-180' : ''}`}
                >
                  <IoIosArrowDown size={24} />
                </span>
              </p>
              {timeRangeOptionOpen && (
                <ul
                  className='absolute p-1 space-y-2 bg-white shadow-md rounded-xl -left-6 -bottom-36'
                  style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
                >
                  {timeRangeOptions.map((option, index) => (
                    <li
                      key={index}
                      className={`px-5 py-2 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-150 ease-out hover:bg-orange hover:text-white ${
                        timeRange === option.value ? 'bg-orange text-white' : ''
                      }`}
                      onClick={() => timeRangeChangeHandler(option.value)}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <SalesChart
            salesData={salesData?.d || []}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </div>

        <div
          className='col-span-2 p-5 space-y-5 overflow-hidden bg-white rounded-xl'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
        >
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Suppliers</h2>

            <button
              className='px-3 py-1 text-sm font-medium transition duration-150 ease-out border rounded-full text-orange border-orange hover:bg-orange hover:text-white'
              onClick={() => addSupplierRef.current.openModal()}
            >
              Add Supplier
            </button>
          </div>

          <ModalWrapper ref={addSupplierRef}>
            <div className='space-y-5 w-[400px]'>
              <h1 className='font-medium text-orange '>Add Supplier</h1>

              <form
                onSubmit={handleSubmit}
                className='flex flex-col px-3 space-y-4 text-base font-medium'
              >
                <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
                  <label
                    htmlFor='name'
                    className='flex-shrink-0 block text-sm font-medium text-gray-700'
                  >
                    Name :
                  </label>

                  <input
                    className='w-full bg-transparent outline-none'
                    type='text'
                    name='name'
                    value={newSupplier.name}
                    onChange={handleNewSupplierFormChange}
                  />
                </div>

                <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
                  <label
                    htmlFor='name'
                    className='flex-shrink-0 block text-sm font-medium text-gray-700'
                  >
                    Contact Number :
                  </label>

                  <input
                    className='w-full bg-transparent outline-none no-spinner'
                    type='number'
                    name='contactNumber'
                    value={newSupplier.contactNumber}
                    onChange={handleNewSupplierFormChange}
                  />
                </div>

                <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
                  <label
                    htmlFor='name'
                    className='flex-shrink-0 block text-sm font-medium text-gray-700'
                  >
                    Email :
                  </label>

                  <input
                    className='w-full bg-transparent outline-none'
                    type='text'
                    name='email'
                    value={newSupplier.email}
                    onChange={handleNewSupplierFormChange}
                  />
                </div>

                <div className='flex items-center gap-2 py-2 border-b-2 border-orange'>
                  <label
                    htmlFor='name'
                    className='flex-shrink-0 block text-sm font-medium text-gray-700'
                  >
                    Address :
                  </label>

                  <input
                    className='w-full bg-transparent outline-none'
                    type='text'
                    name='address'
                    value={newSupplier.address}
                    onChange={handleNewSupplierFormChange}
                  />
                </div>

                <button
                  className='px-3 py-2 mx-auto text-white transition border rounded-xl bg-orange border-orange hover:bg-transparent hover:text-orange'
                  type='submit'
                >
                  Add Supplier
                </button>
              </form>
            </div>
          </ModalWrapper>

          <Suppliers suppliers={suppliers?.d || []} />
        </div>

        <div
          className='col-span-3 p-8 space-y-6 bg-white rounded-xl'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
        >
          <div className='flex justify-between'>
            <h2 className='text-lg font-semibold'>Total Sales by Status</h2>
          </div>
          <SalesByStatusChart salesStatus={salesByStatus?.d || []} />
        </div>

        <div
          className='col-span-3 p-8 space-y-6 overflow-hidden bg-white rounded-xl'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)', height: '100%' }}
        >
          <div className='flex justify-between'>
            <h2 className='text-lg font-semibold'>Stock Alert</h2>
          </div>

          <StockAlert stockAlert={stockAlert?.d || []} />
        </div>
      </div>
    </div>
  )
}
