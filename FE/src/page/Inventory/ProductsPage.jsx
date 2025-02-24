import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SeachBar } from '../../components/Inventory/SeachBar'

export const ProductsPage = () => {
  const [search, setSearch] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000)

    return () => clearTimeout(handler)
  }, [search])

  return (
    <div className='flex flex-col h-full space-y-2 overflow-hidden bg-secondBg'>
      <div className='flex items-center justify-between flex-shrink-0 h-20 px-10 bg-white border-b-2'>
        <SeachBar
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={'Search a product'}
        />
      </div>

      <div className='h-full p-5 overflow-auto '>
        <Outlet context={{ debounceSearch }} />
      </div>
    </div>
  )
}
