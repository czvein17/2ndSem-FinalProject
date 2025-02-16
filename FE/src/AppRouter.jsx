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
import { ManageUserLayout } from './layout/Admin/ManageUserLayout'
import { CreateNewUser } from './page/AdminPage/subPage/CreateNewUser'
import HomeAdminPage from './page/AdminPage/subPage/HomeAdminPage'
import { NotFound404 } from './components/NotFound404'
import { RecomendProduct } from './page/AdminPage/subPage/RecomendProduct'
import { UserLayout } from './layout/User/UserLayout'
import { UserHomePage } from './page/User/UserHomePage'
import { Success } from './components/Success'

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
        </>
      )}
      <Route path='/user' element={<UserLayout />}>
        <Route index element={<UserHomePage />} />
        <Route path='/user/menu' element={<>menu</>} />

        {isLoggedIn && (
          <Route element={<PrivateRoute roles={['user']} />}>
            <Route path='/user/orders' element={<>orders</>} />
            <Route path='/user/history' element={<>history</>} />

            <Route path='/user/profile' element={<>profile</>} />
            <Route path='/user/settings' element={<>settings</>} />
          </Route>
        )}
      </Route>

      <Route path='*' element={<NotFound404 />} />
    </Routes>
  )
}

export default AppRouter
