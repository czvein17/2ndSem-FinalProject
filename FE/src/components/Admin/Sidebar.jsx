import { RxDashboard } from 'react-icons/rx'
import { AiOutlineLogout } from 'react-icons/ai'
import { LuUsersRound } from 'react-icons/lu'
import { IoChatbubblesOutline } from 'react-icons/io5'

import { SideBarList } from './SideBarList'
import { useAuth } from '../../hooks/useAuth'
import { SidebarList } from '../Sidebar/SidebarList'

const Sidebar = () => {
  const { logout } = useAuth()
  const sidebar = [
    {
      path: '/inventory',
      name: 'Dashboard',
      icon: <RxDashboard size={20} />,
    },
    {
      path: '/inventory/manage-users',
      name: 'Users',
      icon: <LuUsersRound size={20} />,
    },
    {
      path: '/inventory/chat',
      name: 'Chat Bot',
      icon: <IoChatbubblesOutline size={20} />,
    },
    {
      path: '/inventory/recommend',
      name: 'Recommendation',
      icon: <RxDashboard size={20} />,
    },
  ]

  return (
    <div className='flex flex-col justify-between w-full h-full'>
      <div className='h-1/6 '>
        <h1 className='text-2xl font-semibold text-center text-primary'>Admin</h1>
      </div>

      <ul className='flex flex-col w-full h-full space-y-4'>
        {sidebar.map((item) => (
          <SidebarList key={item.path} item={item}>
            {item.icon}
            {item.name}
          </SidebarList>
        ))}
      </ul>

      <div className='flex items-center justify-center w-full'>
        <button
          onClick={logout}
          className='flex items-center gap-3 px-5 py-3 text-lg transition ease-in rounded-lg hover:bg-secondary'
        >
          <AiOutlineLogout size={24} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
