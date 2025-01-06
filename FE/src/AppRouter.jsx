import { Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

//PAGE
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
// ADMIN PAGES
import AdminPage from './page/AdminPage/AdminPage'
import MangeUserPage from './page/AdminPage/subPage/ManageUserPage'
import AdminChatBot from './page/AdminPage/subPage/AdminChatBot'

// USER PAGES
import UserPage from './page/User/UserPage'
import { ManageUserLayout } from './layout/Admin/ManageUserLayout'
import { CreateNewUser } from './page/AdminPage/subPage/CreateNewUser'
import HomeAdminPage from './page/AdminPage/subPage/HomeAdminPage'
import { NotFound404 } from './components/NotFound404'
import { RecomendProduct } from './page/AdminPage/subPage/RecomendProduct'

const AppRouter = () => {
  const { isLoggedIn } = useAuth()

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/test' element={<h1>Test</h1>} />

      {isLoggedIn && (
        <>
          <Route element={<PrivateRoute roles={['admin']} />}>
            <Route path='/admin' element={<AdminPage />}>
              <Route index element={<HomeAdminPage />} />
              <Route path='/admin/manage-users' element={<ManageUserLayout />}>
                <Route index element={<MangeUserPage />} />
                <Route
                  path='/admin/manage-users/create'
                  element={<CreateNewUser />}
                />
              </Route>

              <Route path='/admin/chat' element={<AdminChatBot />} />
              <Route path='/admin/chat/:id' element={<AdminChatBot />} />

              <Route path='/admin/recommend' element={<RecomendProduct />} />

              <Route path='/admin/page4' element={<>ADD USER 3</>} />
            </Route>
          </Route>

          <Route element={<PrivateRoute roles={['user']} />}>
            <Route path='/user' element={<UserPage />} />
          </Route>
        </>
      )}

      <Route path='*' element={<NotFound404 />} />
    </Routes>
  )
}

export default AppRouter
