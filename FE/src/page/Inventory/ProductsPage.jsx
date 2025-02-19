import { IoSearchOutline } from 'react-icons/io5'
import { Outlet } from 'react-router-dom'

export const ProductsPage = () => {
  return (
    <div className='flex flex-col h-full space-y-2 overflow-hidden bg-secondBg'>
      <div className='flex items-center justify-between flex-shrink-0 h-20 px-10 bg-white border-b-2'>
        <div
          className='flex items-center w-1/4 gap-2 px-2 rounded-full h-9 bg-secondBg'
          style={{ boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.1)' }}
        >
          <span>
            <IoSearchOutline size={20} />
          </span>
          <input
            type='text'
            placeholder='Search Product'
            className='w-full text-sm bg-transparent outline-none'
          />
        </div>
      </div>

      <div className='h-full p-5 overflow-auto custom-scrollbar'>
        <Outlet />
      </div>
    </div>
  )
}
