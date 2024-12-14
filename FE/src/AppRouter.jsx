import { Route, Routes } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

//PAGE
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
// ADMIN PAGES
import AdminPage from "./page/AdminPage/AdminPage";
import AdminPage1 from "./page/AdminPage/subPage/AdminPage1";

import UserPage from "./page/User/UserPage";

const AppRouter = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {isLoggedIn && (
        <>
          <Route element={<PrivateRoute roles={["admin"]} />}>
            <Route path="admin" element={<AdminPage />}>
              <Route index element={<>HOME</>} />
              <Route path="page1" element={<AdminPage1 />} />
              <Route path="page2" element={<>PAGE 2</>} />
              <Route path="page3" element={<> PAGE 3</>} />
            </Route>
          </Route>

          <Route element={<PrivateRoute roles={["user"]} />}>
            <Route path="user" element={<UserPage />} />
          </Route>
        </>
      )}
    </Routes>
  );
};

export default AppRouter;
