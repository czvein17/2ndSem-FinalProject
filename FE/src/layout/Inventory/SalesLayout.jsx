import { Outlet } from 'react-router-dom'
import { SeachBar } from '../../components/Inventory/SeachBar'
import { useEffect, useState } from 'react'

export const SalesLayout = () => {
  const [search, setSearch] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(search)
    }, 1000)

    return () => clearTimeout(handler)
  }, [search])

  return (
    <div className='flex flex-col h-full overflow-hidden bg-secondBg'>
      <div className='flex items-center justify-between flex-shrink-0 h-20 px-10 bg-white border-b-2 '>
        <SeachBar
          search={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={'Search Sales'}
        />
      </div>

      <div className='h-full overflow-hidden'>
        <Outlet context={{ debounceSearch }} />
      </div>
    </div>
  )
}
