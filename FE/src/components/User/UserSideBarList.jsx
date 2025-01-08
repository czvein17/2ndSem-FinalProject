import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

export const UserSideBarList = ({ index, item }) => {
  return (
    <NavLink
      end
      to={item.path}
      className={`relative flex items-center gap-3 px-10 py-3 text-sm`}
    >
      {({ isActive }) => (
        <motion.div
          className='flex items-center w-full gap-3'
          animate={{ color: isActive ? '#FFA500' : '#000000' }} // Animate color change
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          whileHover={{ color: '#FFA500' }}
        >
          {item.icon} {item.name}
          {isActive && (
            <motion.div
              className='absolute right-0 w-[3px] h-full rounded-l-xl bg-orange'
              layoutId={`${index < 3 ? 'activeIndicator' : 'bottomActiveIndicatior'} `}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      )}
    </NavLink>
  )
}
