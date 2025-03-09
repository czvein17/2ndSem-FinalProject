import { Outlet } from 'react-router-dom'
import { SeachBar } from '../../components/Inventory/SeachBar'

export const SalesLayout = () => {
  return (
    <div className='flex flex-col h-full overflow-hidden bg-secondBg'>
      <div className='flex items-center justify-between flex-shrink-0 h-20 px-10 bg-white border-b-2 '>
        <SeachBar placeholder={'Search Sales'} />
      </div>

      <div className='h-full overflow-hidden'>
        <Outlet />
      </div>
    </div>
  )
}
