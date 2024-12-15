import { NavLink } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const SideBarList = ({ path, children }) => {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        `py-4 px-5 rounded-lg text-sm font-semibold flex items-center gap-5 hover:bg-secondary transition-all ease-in-out ${
          isActive ? 'bg-secondary' : 'bg-white'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
