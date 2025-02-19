import { NavLink, useLocation } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const SideBarList = ({ path, children }) => {
  const location = useLocation()
  const isActive =
    path === '/admin'
      ? location.pathname === path
      : location.pathname.startsWith(path)

  return (
    <NavLink
      to={path}
      className={() =>
        `py-4 px-5 rounded-lg text-sm font-semibold flex items-center gap-5 hover:bg-secondary transition-all ease-in-out text-red-[#322f30] ${
          isActive ? 'bg-secondary' : 'bg-white'
        }`
      }
    >
      {children}
    </NavLink>
  )
}
