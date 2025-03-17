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
import { OrderPage } from './page/POS/Order/OrderPage'
import { InventoryLayout } from './layout/Inventory/InventoryLayout'

// INVENTORY PAGES
import { ProductsPage } from './page/Inventory/ProductsPage'
import { Dashboard } from './page/Inventory/Dashboard'
import { Products } from './components/Inventory/Products/Products'
import { ViewProduct } from './components/Inventory/Products/ViewProduct'
import { Stocks } from './page/Inventory/Stocks'
import { StocksLayout } from './layout/Inventory/StocksLayout'
import { SalesLayout } from './layout/Inventory/SalesLayout'
import { Sales } from './page/Inventory/Sales'
import { UnderConstruction } from './components/UnderConstruction'

const AppRouter = () => {
  const { isLoggedIn } = useAuth()

  return (
    <Routes>
      <Route path='/' element={<Login />} />

      {isLoggedIn && (
        <>
          <Route element={<PrivateRoute roles={['admin']} />}>
            <Route path='/inventory' element={<InventoryLayout />}>
              <Route index element={<Dashboard />} />

              <Route path='/inventory/products' element={<ProductsPage />}>
                <Route index element={<Products />} />
                <Route path='/inventory/products/:id' element={<ViewProduct />} />
              </Route>

              <Route path='/inventory/stocks' element={<StocksLayout />}>
                <Route index element={<Stocks />} />
              </Route>

              <Route path='/inventory/orders' element={<h1>Orders</h1>} />

              <Route path='/inventory/sales' element={<SalesLayout />}>
                <Route index element={<Sales />} />
              </Route>
            </Route>

            {/* <Route path='/inventory' element={<AdminPage />}>
              <Route index element={<HomeAdminPage />} />
              
              <Route path='/inventory/manage-users' element={<ManageUserLayout />}>
                <Route index element={<MangeUserPage />} />
                <Route
                  path='/inventory/manage-users/create'
                  element={<CreateNewUser />}
                />
              </Route>

              <Route path='/inventory/chat' element={<AdminChatBot />} />
              <Route path='/inventory/chat/:id' element={<AdminChatBot />} />
              <Route path='/inventory/recommend' element={<RecomendProduct />} />
              <Route path='/inventory/page4' element={<>ADD USER 3</>} />
            </Route> */}
          </Route>
        </>
      )}

      <Route path='/user' element={<UserLayout />}>
        <Route index element={<UserHomePage />} />
        <Route path='/user/menu' element={<>menu</>} />

        {isLoggedIn && (
          <Route element={<PrivateRoute roles={['user']} />}>
            <Route path='/user/orders' element={<OrderPage />} />
            <Route path='/user/history' element={<>history</>} />

            <Route path='/user/profile' element={<UnderConstruction />} />
            <Route path='/user/settings' element={<UnderConstruction />} />
          </Route>
        )}
      </Route>

      <Route path='*' element={<NotFound404 />} />
    </Routes>
  )
}

export default AppRouter
