import { Route, Routes } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

//PAGE
import Login from "./components/Login";
import AdminPage from "./page/AdminPage";
import PrivateRoute from "./components/PrivateRoute";
import UserPage from "./page/User/UserPage";

const AppRouter = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {isLoggedIn && (
        <>
          <Route element={<PrivateRoute roles={["admin"]} />}>
            <Route path="admin" element={<AdminPage />} />
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
