import { Outlet } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

import Header from '../../components/Admin/Header'
import Sidebar from '../../components/Admin/Sidebar'

const AdminPage = () => {
  return (
    <div className='relative flex flex-row-reverse items-center justify-center h-screen bg-background font-inter'>
      <div className='flex flex-col w-full h-full'>
        <Header />

        <div className='h-full px-5 overflow-auto bg-transparent'>
          <Outlet />
        </div>
      </div>
      <div className='flex-none hidden w-64 h-full border-r lg:flex border-gray'>
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
