import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { getAllSales } from '../../API/sales'
import { SalesTable } from '../../components/Inventory/Sales/SalesTable'
import { useOutletContext } from 'react-router-dom'

export const Sales = () => {
  const { debounceSearch } = useOutletContext()
  const [currentPage, setCurrentPage] = useState(1)

  const queryParams = useMemo(
    () => ({
      searchBy: '_id',
      search: debounceSearch,
      page: currentPage,
      limit: 10,
    }),
    [debounceSearch, currentPage],
  )

  const {
    data: sales,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['sales', queryParams],
    queryFn: () => getAllSales(queryParams),
  })

  return (
    <div className='flex flex-col h-full p-5'>
      <div className='flex items-center justify-between flex-shrink-0 h-12'>
        <p>Track your sales record here</p>
      </div>
      {!isPending && !isError && (
        <SalesTable
          sales={sales}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* <div className='flex flex-col h-full p-5 overflow-hidden bg-slate-500'>
        <div className='h-full pb-5 overflow-hidden'>
          <div className='h-full overflow-y-auto'>
            <div className='bg-red-200 h-[500px]'>1</div>
            <div className='bg-red-200 h-[500px]'>1</div>
            <div className='bg-red-200 h-[500px]'>1</div>
          </div>
        </div>
      </div> */}
    </div>
  )
}
