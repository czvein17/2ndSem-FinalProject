import Cookies from "js-cookie";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { checkAuth } from "../utils/checkAuth";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(checkAuth());
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) navigate("/");
  }, [navigate]);

  const navigateLogin = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "user":
        navigate("/user");
        break;
      default:
        navigate("/");
    }
  };

  const login = (userData) => {
    if (userData.data?.message) {
      setError(userData.data?.message);

      setTimeout(() => {
        setError("");
      }, 5000);

      return;
    }

    console.log(userData.data);
    localStorage.setItem("user", JSON.stringify(userData?.data));
    localStorage.setItem("token", userData?.token);

    setIsLoggedIn(checkAuth());
    setUser(userData?.data);
    navigateLogin(userData?.data?.role);
  };

  const logout = () => {
    localStorage.clear();
    Cookies.remove("jwt");
    setUser(null);
    setIsLoggedIn(false);

    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, logout, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
