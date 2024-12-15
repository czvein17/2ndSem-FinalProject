import { Outlet } from 'react-router-dom'

import Header from '../../components/Admin/Header'
import Sidebar from '../../components/Admin/Sidebar'

const AdminPage = () => {
  return (
    <div className='h-screen flex  flex-row-reverse items-center justify-center bg-background font-inter'>
      <div className='w-full h-full flex flex-col'>
        <Header />
        <div className='p-5 h-full overflow-auto'>
          <Outlet />
        </div>
      </div>
      <div className='hidden md:flex flex-none w-64 h-full border-r border-gray  p-5'>
        <Sidebar />
      </div>
    </div>
  )
}

export default AdminPage
