import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartContext } from '../../hooks/useCartContext'

export const SidebarList = ({ index, item }) => {
  const { pendingOrdersCount } = useCartContext()
  const location = useLocation()

  const isActive =
    item.path === '/inventory' || item.path === '/user'
      ? location.pathname === item.path
      : location.pathname.startsWith(item.path)

  return (
    <NavLink
      to={item.path}
      className={`relative flex items-center gap-3 px-10 py-3 text-sm`}
    >
      <motion.div
        className='flex items-center w-full gap-3'
        animate={{ color: isActive ? '#FFA500' : '#000000' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        whileHover={{ color: '#FFA500' }}
      >
        {item.icon} {item.name}
        {item.name === 'Orders' && (
          <span className='flex items-center justify-center w-6 h-6 p-2 text-white rounded-full bg-orange'>
            {pendingOrdersCount}
          </span>
        )}
        {isActive && (
          <motion.div
            className='absolute right-0 w-[3px] h-full rounded-l-xl bg-orange'
            layoutId={`${index < 3 ? 'activeIndicator' : 'bottomActiveIndicatior'} `}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    </NavLink>
  )
}
