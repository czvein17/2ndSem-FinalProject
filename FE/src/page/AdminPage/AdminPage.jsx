import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import Header from '../../components/Admin/Header'
import Sidebar from '../../components/Admin/Sidebar'

const AdminPage = () => {
  return (
    <div className='h-screen flex  flex-row-reverse items-center justify-center bg-background font-inter relative'>
      <div className='w-full h-full flex flex-col'>
        <Header />
        <div className='px-5 h-full overflow-auto'>
          <Outlet />
        </div>
      </div>
      <div className='hidden lg:flex flex-none w-64 h-full border-r border-gray  p-5'>
        <Sidebar />
      </div>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        closeButton={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default AdminPage
