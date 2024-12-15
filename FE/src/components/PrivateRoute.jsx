/* eslint-disable react/prop-types */
import { useAuth } from '../hooks/useAuth'
import { checkAuth } from '../utils/checkAuth'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoute = ({ roles }) => {
  const { user } = useAuth()
  const token = checkAuth()

  if (!token && !user) {
    return <Navigate to='/' />
  }

  if (roles && roles.indexOf(user.role) === -1) {
    return <Navigate to='/' />
  }

  return <Outlet />
}

export default PrivateRoute
